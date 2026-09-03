import fs from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { dataDir } from './file-store';
import { imbasBukti, imbasanMembenarkan } from '@/lib/imbasan';
import { nyahsulitBait, sulitkanBait } from '@/lib/kripto';

export { MAKS_FAIL, MAKS_BAIT } from './bukti.client';
import { MAKS_BAIT } from './bukti.client';

type JenisImej = { mime: string; ext: string };

/**
 * Kenal pasti jenis imej daripada bait pertama fail, bukan daripada nama fail
 * atau `Content-Type` yang dihantar pelayar — kedua-duanya boleh dipalsukan.
 */
export function kenalPastiImej(bait: Uint8Array): JenisImej | undefined {
  if (bait.length > 3 && bait[0] === 0xff && bait[1] === 0xd8 && bait[2] === 0xff) {
    return { mime: 'image/jpeg', ext: 'jpg' };
  }
  const png = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  if (bait.length > 8 && png.every((b, i) => bait[i] === b)) {
    return { mime: 'image/png', ext: 'png' };
  }
  const teks = new TextDecoder('latin1').decode(bait.subarray(0, 12));
  if (teks.startsWith('RIFF') && teks.slice(8, 12) === 'WEBP') {
    return { mime: 'image/webp', ext: 'webp' };
  }
  return undefined;
}

/**
 * Buang metadata daripada imej sebelum ia disimpan.
 *
 * Tangkapan skrin dan foto mangsa kerap membawa EXIF termasuk koordinat GPS.
 * Menyimpannya bermakna kita memproses data peribadi yang tidak diperlukan
 * untuk tujuan asal — jadi ia dibuang pada titik masuk, bukan kemudian.
 */
export function buangMetadata(bait: Uint8Array, jenis: JenisImej): Uint8Array {
  if (jenis.mime === 'image/jpeg') return buangMetadataJpeg(bait);
  if (jenis.mime === 'image/png') return buangMetadataPng(bait);
  if (jenis.mime === 'image/webp') return buangMetadataWebp(bait);
  return bait;
}

/** JPEG: kekalkan hanya segmen yang diperlukan untuk mendekod imej. */
function buangMetadataJpeg(bait: Uint8Array): Uint8Array {
  const keluar: Uint8Array[] = [bait.subarray(0, 2)]; // SOI
  let i = 2;

  while (i + 3 < bait.length) {
    if (bait[i] !== 0xff) break;
    const penanda = bait[i + 1] as number;

    // SOS: selebihnya adalah data imej — salin terus.
    if (penanda === 0xda) {
      keluar.push(bait.subarray(i));
      break;
    }
    const panjang = ((bait[i + 2] as number) << 8) | (bait[i + 3] as number);
    if (panjang < 2) break;

    // APP1..APP15 (EXIF, XMP, IPTC) dan COM dibuang. APP0/JFIF dikekalkan.
    const buang = (penanda >= 0xe1 && penanda <= 0xef) || penanda === 0xfe;
    if (!buang) keluar.push(bait.subarray(i, i + 2 + panjang));
    i += 2 + panjang;
  }

  return gabung(keluar);
}

/** PNG: buang chunk teks & EXIF, kekalkan chunk lain. */
function buangMetadataPng(bait: Uint8Array): Uint8Array {
  const dibuang = new Set(['eXIf', 'tEXt', 'iTXt', 'zTXt', 'tIME']);
  const keluar: Uint8Array[] = [bait.subarray(0, 8)];
  const view = new DataView(bait.buffer, bait.byteOffset, bait.byteLength);
  let i = 8;

  while (i + 8 <= bait.length) {
    const panjang = view.getUint32(i);
    const jenis = new TextDecoder('latin1').decode(bait.subarray(i + 4, i + 8));
    const hujung = i + 12 + panjang;
    if (hujung > bait.length) break;
    if (!dibuang.has(jenis)) keluar.push(bait.subarray(i, hujung));
    i = hujung;
    if (jenis === 'IEND') break;
  }

  return gabung(keluar);
}

/** WebP: buang chunk EXIF/XMP dalam bekas RIFF dan kemas kini saiz RIFF. */
function buangMetadataWebp(bait: Uint8Array): Uint8Array {
  const dibuang = new Set(['EXIF', 'XMP ']);
  const view = new DataView(bait.buffer, bait.byteOffset, bait.byteLength);
  const keluar: Uint8Array[] = [];
  let i = 12;

  while (i + 8 <= bait.length) {
    const jenis = new TextDecoder('latin1').decode(bait.subarray(i, i + 4));
    const panjang = view.getUint32(i + 4, true);
    const berlapik = panjang + (panjang % 2);
    const hujung = i + 8 + berlapik;
    if (hujung > bait.length) break;
    if (!dibuang.has(jenis)) keluar.push(bait.subarray(i, hujung));
    i = hujung;
  }

  const isi = gabung(keluar);
  const hasil = new Uint8Array(12 + isi.length);
  hasil.set(bait.subarray(0, 12));
  hasil.set(isi, 12);
  new DataView(hasil.buffer).setUint32(4, 4 + isi.length, true);
  return hasil;
}

function gabung(bahagian: Uint8Array[]): Uint8Array {
  const jumlah = bahagian.reduce((n, b) => n + b.length, 0);
  const hasil = new Uint8Array(jumlah);
  let offset = 0;
  for (const b of bahagian) {
    hasil.set(b, offset);
    offset += b.length;
  }
  return hasil;
}

export function buktiDir(): string {
  return path.join(dataDir(), 'bukti');
}

export type HasilSimpan = { nama: string } | { ralat: 'jenis' | 'saiz' | 'malware' };

/**
 * Simpan satu fail bukti.
 *
 * Urutan penting: saiz → jenis sebenar (bait ajaib) → buang metadata →
 * imbas malware → sulitkan → tulis. Nama fail dijana; nama asal daripada
 * pengguna tidak pernah menyentuh sistem fail.
 */
export async function simpanBukti(fail: File): Promise<HasilSimpan> {
  if (fail.size > MAKS_BAIT) return { ralat: 'saiz' };

  const bait = new Uint8Array(await fail.arrayBuffer());
  const jenis = kenalPastiImej(bait);
  if (!jenis) return { ralat: 'jenis' };

  const bersih = buangMetadata(bait, jenis);

  // Gagal-tutup: pengimbas yang dikonfigurasi tetapi tidak dapat dihubungi
  // menolak muat naik, bukan membenarkannya.
  const imbasan = await imbasBukti(bersih);
  if (!imbasanMembenarkan(imbasan)) return { ralat: 'malware' };

  const nama = `${randomUUID()}.${jenis.ext}`;
  await fs.mkdir(buktiDir(), { recursive: true });
  await fs.writeFile(path.join(buktiDir(), nama), sulitkanBait(bersih));
  return { nama };
}

/** Buang satu fail bukti daripada cakera (pembersihan / permintaan PDPA). */
export async function buangBukti(nama: string): Promise<void> {
  if (!/^[0-9a-f-]{36}\.(jpg|png|webp)$/.test(nama)) return;
  await fs.rm(path.join(buktiDir(), nama), { force: true });
}

const MIME_IKUT_EXT: Record<string, string> = {
  jpg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
};

/** Baca fail bukti untuk moderator. Nama fail disahkan sebelum akses cakera. */
export async function bacaBukti(nama: string): Promise<{ bait: Uint8Array; mime: string } | undefined> {
  const padanan = /^([0-9a-f-]{36})\.(jpg|png|webp)$/.exec(nama);
  const ext = padanan?.[2];
  if (!padanan || !ext) return undefined;
  try {
    const bait = await fs.readFile(path.join(buktiDir(), nama));
    return { bait: nyahsulitBait(new Uint8Array(bait)), mime: MIME_IKUT_EXT[ext] as string };
  } catch {
    return undefined;
  }
}
