import { isJenisKenalan, type JenisKenalan } from './types';

export const MEDAN = ['jenis_kenalan', 'nilai_kenalan', 'kategori_slug', 'penerangan', 'pelapor_emel', 'pdpa'] as const;
export type Medan = (typeof MEDAN)[number];

export const KOD_RALAT = ['wajib', 'terlalu_pendek', 'terlalu_panjang', 'tidak_sah', 'pdpa'] as const;
export type KodRalat = (typeof KOD_RALAT)[number];

export type NilaiBorang = {
  jenis_kenalan: JenisKenalan;
  nilai_kenalan: string;
  kategori_slug: string | null;
  penerangan: string;
  pelapor_emel: string | null;
};

/** Nilai mentah untuk mengisi semula borang selepas ralat. */
export type NilaiMentah = {
  jenis_kenalan: string;
  nilai_kenalan: string;
  kategori_slug: string;
  penerangan: string;
  pelapor_emel: string;
  pdpa: boolean;
};

export type HasilValidasi =
  | { ok: true; nilai: NilaiBorang }
  | { ok: false; ralat: Partial<Record<Medan, KodRalat>> };

export const PANJANG = {
  nilaiMin: 3,
  nilaiMaks: 200,
  peneranganMin: 20,
  peneranganMaks: 5000,
} as const;

const EMEL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Baca semula apa yang pengguna taip.
 *
 * React menetapkan semula borang selepas satu action selesai, jadi tanpa ini
 * pengguna yang terlepas satu medan akan kehilangan seluruh laporan mereka.
 */
export function nilaiMentah(data: FormData): NilaiMentah {
  return {
    jenis_kenalan: teks(data, 'jenis_kenalan'),
    nilai_kenalan: teks(data, 'nilai_kenalan'),
    kategori_slug: teks(data, 'kategori_slug'),
    penerangan: teks(data, 'penerangan'),
    pelapor_emel: teks(data, 'pelapor_emel'),
    pdpa: Boolean(data.get('pdpa')),
  };
}

function teks(data: FormData, nama: string): string {
  const nilai = data.get(nama);
  return typeof nilai === 'string' ? nilai.trim().replace(/\s+/g, ' ') : '';
}

/**
 * Sahkan borang laporan komuniti.
 *
 * Kod ralat dikembalikan (bukan ayat) supaya mesej boleh dipaparkan dalam
 * bahasa pilihan pengguna daripada dictionary.
 */
export function sahkanBorangLaporan(data: FormData, slugSah: string[]): HasilValidasi {
  const ralat: Partial<Record<Medan, KodRalat>> = {};

  const jenis = teks(data, 'jenis_kenalan');
  if (!jenis) ralat.jenis_kenalan = 'wajib';
  else if (!isJenisKenalan(jenis)) ralat.jenis_kenalan = 'tidak_sah';

  const nilai = teks(data, 'nilai_kenalan');
  if (!nilai) ralat.nilai_kenalan = 'wajib';
  else if (nilai.length < PANJANG.nilaiMin) ralat.nilai_kenalan = 'terlalu_pendek';
  else if (nilai.length > PANJANG.nilaiMaks) ralat.nilai_kenalan = 'terlalu_panjang';

  const kategoriMentah = teks(data, 'kategori_slug');
  const kategori = kategoriMentah === '' ? null : kategoriMentah;
  if (kategori && !slugSah.includes(kategori)) ralat.kategori_slug = 'tidak_sah';

  const penerangan = teks(data, 'penerangan');
  if (!penerangan) ralat.penerangan = 'wajib';
  else if (penerangan.length < PANJANG.peneranganMin) ralat.penerangan = 'terlalu_pendek';
  else if (penerangan.length > PANJANG.peneranganMaks) ralat.penerangan = 'terlalu_panjang';

  const emelMentah = teks(data, 'pelapor_emel');
  const emel = emelMentah === '' ? null : emelMentah;
  if (emel && !EMEL.test(emel)) ralat.pelapor_emel = 'tidak_sah';

  // PDPA: persetujuan mesti diberi secara aktif. Tiada laporan tanpa ini.
  if (!data.get('pdpa')) ralat.pdpa = 'pdpa';

  if (Object.keys(ralat).length > 0) return { ok: false, ralat };

  return {
    ok: true,
    nilai: {
      jenis_kenalan: jenis as JenisKenalan,
      nilai_kenalan: nilai,
      kategori_slug: kategori,
      penerangan,
      pelapor_emel: emel,
    },
  };
}

export type NilaiBantahan = {
  laporan_id: string;
  pembantah_nama: string;
  pembantah_emel: string;
  hujah: string;
};

export type HasilBantahan =
  | { ok: true; nilai: NilaiBantahan }
  | { ok: false; ralat: Partial<Record<'pembantah_nama' | 'pembantah_emel' | 'hujah' | 'pdpa', KodRalat>> };

export function sahkanBorangBantahan(data: FormData): HasilBantahan {
  const ralat: Partial<Record<'pembantah_nama' | 'pembantah_emel' | 'hujah' | 'pdpa', KodRalat>> = {};

  const nama = teks(data, 'pembantah_nama');
  if (!nama) ralat.pembantah_nama = 'wajib';

  const emel = teks(data, 'pembantah_emel');
  if (!emel) ralat.pembantah_emel = 'wajib';
  else if (!EMEL.test(emel)) ralat.pembantah_emel = 'tidak_sah';

  const hujah = teks(data, 'hujah');
  if (!hujah) ralat.hujah = 'wajib';
  else if (hujah.length < 20) ralat.hujah = 'terlalu_pendek';
  else if (hujah.length > 5000) ralat.hujah = 'terlalu_panjang';

  if (!data.get('pdpa')) ralat.pdpa = 'pdpa';

  if (Object.keys(ralat).length > 0) return { ok: false, ralat };

  return {
    ok: true,
    nilai: { laporan_id: teks(data, 'laporan_id'), pembantah_nama: nama, pembantah_emel: emel, hujah },
  };
}
