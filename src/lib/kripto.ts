import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

/**
 * Enkripsi data peribadi semasa simpan (encryption at rest).
 *
 * Digunakan untuk medan yang boleh mengenal pasti seseorang — e-mel pelapor,
 * kontak pembantah — dan untuk fail bukti. Pangkalan data yang bocor tanpa
 * kunci tidak mendedahkan sesiapa.
 *
 * Algoritma: AES-256-GCM (menyulitkan DAN mengesahkan; ciphertext yang diubah
 * akan gagal dinyahsulit, bukan menghasilkan sampah).
 *
 * Kunci datang daripada `DATA_ENCRYPTION_KEY` (64 aksara hex = 32 bait).
 * Jana dengan: openssl rand -hex 32
 */

const AWALAN = 'enc:v1:';
/** Cap fail bukti bersulit: "ENC1" diikuti IV(12) + tag(16) + ciphertext. */
const CAP_FAIL = new Uint8Array([0x45, 0x4e, 0x43, 0x31]);

let kunciCache: Buffer | undefined;

function kunci(): Buffer {
  if (kunciCache) return kunciCache;

  const mentah = process.env.DATA_ENCRYPTION_KEY?.trim();
  if (mentah) {
    if (!/^[0-9a-fA-F]{64}$/.test(mentah)) {
      throw new Error('DATA_ENCRYPTION_KEY mesti 64 aksara hex (32 bait). Jana: openssl rand -hex 32');
    }
    kunciCache = Buffer.from(mentah, 'hex');
    return kunciCache;
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('DATA_ENCRYPTION_KEY wajib ditetapkan dalam produksi — data peribadi tidak boleh disimpan tanpa kunci.');
  }

  // Pembangunan: kunci tetap yang boleh diramal supaya data tempatan kekal
  // boleh dibaca antara mula semula. Ia BUKAN rahsia dan tidak boleh digunakan
  // dalam produksi — sebab itu produksi melontar ralat di atas.
  kunciCache = createHash('sha256').update('kunci-pembangunan-tidak-selamat').digest();
  return kunciCache;
}

export function kunciDikonfigurasi(): boolean {
  return Boolean(process.env.DATA_ENCRYPTION_KEY?.trim());
}

/** Untuk ujian: lupakan kunci yang dicache selepas env berubah. */
export function lupakanKunci(): void {
  kunciCache = undefined;
}

export function sudahDisulitkan(nilai: string): boolean {
  return nilai.startsWith(AWALAN);
}

export function sulitkan(teks: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', kunci(), iv);
  const ct = Buffer.concat([cipher.update(teks, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${AWALAN}${iv.toString('base64')}:${tag.toString('base64')}:${ct.toString('base64')}`;
}

/**
 * Nyahsulit. Nilai yang tidak bersulit dikembalikan seadanya supaya rekod lama
 * (sebelum enkripsi diaktifkan) kekal boleh dibaca.
 */
export function nyahsulit(nilai: string): string {
  if (!sudahDisulitkan(nilai)) return nilai;
  const [ivB64, tagB64, ctB64] = nilai.slice(AWALAN.length).split(':');
  if (!ivB64 || !tagB64 || !ctB64) throw new Error('Nilai bersulit rosak.');

  const decipher = createDecipheriv('aes-256-gcm', kunci(), Buffer.from(ivB64, 'base64'));
  decipher.setAuthTag(Buffer.from(tagB64, 'base64'));
  return Buffer.concat([decipher.update(Buffer.from(ctB64, 'base64')), decipher.final()]).toString('utf8');
}

/** Versi pilihan: null masuk, null keluar. */
export function sulitkanPilihan(teks: string | null): string | null {
  return teks === null || teks === '' ? null : sulitkan(teks);
}

export function nyahsulitPilihan(nilai: string | null): string | null {
  return nilai === null ? null : nyahsulit(nilai);
}

// ---- Fail bukti ----

export function sulitkanBait(bait: Uint8Array): Uint8Array {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', kunci(), iv);
  const ct = Buffer.concat([cipher.update(bait), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([CAP_FAIL, iv, tag, ct]);
}

export function failDisulitkan(bait: Uint8Array): boolean {
  return bait.length > 32 && CAP_FAIL.every((b, i) => bait[i] === b);
}

export function nyahsulitBait(bait: Uint8Array): Uint8Array {
  if (!failDisulitkan(bait)) return bait;
  const buf = Buffer.from(bait);
  const iv = buf.subarray(4, 16);
  const tag = buf.subarray(16, 32);
  const ct = buf.subarray(32);
  const decipher = createDecipheriv('aes-256-gcm', kunci(), iv);
  decipher.setAuthTag(tag);
  return new Uint8Array(Buffer.concat([decipher.update(ct), decipher.final()]));
}

/**
 * Indeks buta: HMAC deterministik bagi satu nilai, supaya rekod boleh dicari
 * tanpa menyimpan nilai itu dalam bentuk jelas.
 *
 * Digunakan untuk alamat e-mel digest: ciphertext AES-GCM berbeza setiap kali,
 * jadi ia tidak boleh dijadikan kunci unik. HMAC dengan kunci yang sama boleh.
 */
export function indeksButa(nilai: string): string {
  return createHmac('sha256', kunci()).update(`idx:${nilai.trim().toLowerCase()}`).digest('hex');
}

/** Perbandingan masa tetap untuk rentetan (token, kod). */
export function samaTetap(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/**
 * Sidik jari peranti untuk amaran log masuk baharu.
 * Ia hash — kami tidak menyimpan rentetan ejen pengguna atau IP mentah.
 */
export function sidikJariPeranti(ejen: string, ip: string): string {
  return createHash('sha256').update(`${ejen}|${ip}`).digest('hex').slice(0, 32);
}
