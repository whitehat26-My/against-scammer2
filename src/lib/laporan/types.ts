import type { ReportStatus } from '@/lib/status';

export const JENIS_KENALAN = ['telefon', 'akaun_bank', 'url', 'syarikat', 'profil_sosial', 'lain'] as const;
export type JenisKenalan = (typeof JENIS_KENALAN)[number];

export const TINDAKAN_MODERATOR = [
  'terima',
  'tolak',
  'tanda_dipertikai',
  'buang',
  'buka_semula',
  // Peristiwa keselamatan akaun admin — direkod dalam log audit yang sama.
  'log_masuk',
  'log_masuk_gagal',
  'peranti_baharu',
  'padam_data_peribadi',
] as const;
export type TindakanModerator = (typeof TINDAKAN_MODERATOR)[number];

export function isJenisKenalan(value: unknown): value is JenisKenalan {
  return typeof value === 'string' && (JENIS_KENALAN as readonly string[]).includes(value);
}

export function isTindakanModerator(value: unknown): value is TindakanModerator {
  return typeof value === 'string' && (TINDAKAN_MODERATOR as readonly string[]).includes(value);
}

export type Laporan = {
  id: string;
  jenis_kenalan: JenisKenalan;
  /** Nilai yang dilaporkan, dinormalkan (cth. +60123456789). */
  nilai_kenalan: string;
  /** SHA-256 bagi nilai yang dinormalkan — untuk carian tanpa mendedahkan carian. */
  nilai_hash: string;
  kategori_slug: string | null;
  penerangan: string;
  /** Nama fail bukti. Hanya moderator boleh membacanya. */
  bukti: string[];
  status: ReportStatus;
  bilangan_sokongan: number;
  /** Kontak pelapor adalah pilihan. Laporan tanpa nama diterima. */
  pelapor_emel: string | null;
  pdpa_persetujuan: boolean;
  pdpa_persetujuan_pada: string;
  simpan_sehingga: string;
  disemak_oleh: string | null;
  disemak_pada: string | null;
  catatan_moderator: string | null;
  ditolak_pada: string | null;
  dibuang_pada: string | null;
  tarikh_hantar: string;
  dikemaskini_pada: string;
};

export type LaporanInput = {
  jenis_kenalan: JenisKenalan;
  nilai_kenalan: string;
  kategori_slug: string | null;
  penerangan: string;
  bukti: string[];
  pelapor_emel: string | null;
  pdpa_persetujuan: true;
};

export type SokonganInput = {
  laporan_id: string;
  penerangan: string | null;
  pdpa_persetujuan: true;
};

export type Bantahan = {
  id: string;
  laporan_id: string;
  pembantah_nama: string;
  pembantah_emel: string;
  hujah: string;
  diterima_pada: string;
  diakui_pada: string | null;
  keputusan: 'kekal_dipertikai' | 'dipinda' | 'dibuang' | null;
  keputusan_pada: string | null;
};

export type BantahanInput = {
  laporan_id: string;
  pembantah_nama: string;
  pembantah_emel: string;
  hujah: string;
  pdpa_persetujuan: true;
};

export type LogModerator = {
  id: string;
  laporan_id: string | null;
  bantahan_id: string | null;
  moderator_id: string;
  tindakan: TindakanModerator;
  sebab: string | null;
  /** Alamat IP pentadbir. Data kakitangan, bukan data pengguna awam. */
  ip: string | null;
  tarikh: string;
};

/** Ringkasan awam yang dikembalikan oleh carian julat hash. */
export type PadananJulat = {
  /** 59 aksara terakhir hash. Klien memadankannya secara tempatan. */
  hash_suffix: string;
  laporan_id: string;
  status: ReportStatus;
  bilangan_sokongan: number;
  kategori_slug: string | null;
  tarikh_hantar: string;
};

/**
 * Laporan hanya kelihatan kepada orang awam selepas moderator menyemaknya,
 * dan selagi ia tidak ditolak atau dibuang.
 */
export function bolehTersiar(laporan: Laporan): boolean {
  return (
    laporan.disemak_pada !== null &&
    laporan.ditolak_pada === null &&
    laporan.dibuang_pada === null &&
    (laporan.status === 'dilaporkan_komuniti' || laporan.status === 'dipertikai')
  );
}

/** Laporan yang masih menunggu tindakan moderator. */
export function dalamGiliran(laporan: Laporan): boolean {
  return laporan.status === 'belum_disemak' && laporan.ditolak_pada === null && laporan.dibuang_pada === null;
}
