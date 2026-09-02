/**
 * Sistem status laporan komuniti.
 *
 * Ini adalah mekanisme anti-fitnah teras platform, bukan hiasan UI.
 *
 * Peraturan yang TIDAK boleh dilanggar:
 *  1. Tiada status yang bermaksud "disahkan scammer" / "confirmed scammer".
 *     Hanya PDRM & mahkamah berhak menentukan status jenayah seseorang.
 *  2. Semua bahasa mesti kekal pada "dilaporkan" / "disyaki" / "dipertikai".
 *  3. Setiap laporan mesti melalui moderasi sebelum terbit (moderation-first).
 *
 * Ujian `tests/status.test.ts` menguatkuasakan peraturan (1) & (2) supaya
 * ia tidak boleh "terlepas" masuk dalam kod pada masa hadapan.
 */

export const REPORT_STATUSES = ['belum_disemak', 'dilaporkan_komuniti', 'dipertikai'] as const;
export type ReportStatus = (typeof REPORT_STATUSES)[number];

export type StatusMeta = {
  id: ReportStatus;
  label_ms: string;
  label_en: string;
  keterangan_ms: string;
  keterangan_en: string;
  /** Adakah laporan ini kelihatan kepada orang awam? */
  tersiar: boolean;
  tone: 'neutral' | 'amaran' | 'pertikai';
};

export const STATUS_META: Record<ReportStatus, StatusMeta> = {
  belum_disemak: {
    id: 'belum_disemak',
    label_ms: 'Belum disemak',
    label_en: 'Not yet reviewed',
    keterangan_ms:
      'Laporan baharu dihantar dan sedang menunggu semakan moderator. Ia TIDAK dipaparkan kepada orang awam pada peringkat ini.',
    keterangan_en:
      'A newly submitted report awaiting moderator review. It is NOT shown to the public at this stage.',
    tersiar: false,
    tone: 'neutral',
  },
  dilaporkan_komuniti: {
    id: 'dilaporkan_komuniti',
    label_ms: 'Dilaporkan komuniti',
    label_en: 'Reported by community',
    keterangan_ms:
      'Beberapa pengguna berasingan telah melaporkan perkara yang sama. Ini adalah amaran awal daripada orang ramai — BUKAN pengesahan bahawa satu jenayah telah berlaku. Sentiasa semak di Semak Mule (PDRM).',
    keterangan_en:
      'Several separate users have reported the same thing. This is an early warning from the public — NOT confirmation that a crime occurred. Always verify on Semak Mule (PDRM).',
    tersiar: true,
    tone: 'amaran',
  },
  dipertikai: {
    id: 'dipertikai',
    label_ms: 'Dipertikai',
    label_en: 'Disputed',
    keterangan_ms:
      'Pihak yang dinamakan telah membantah laporan ini dan memberi penjelasan. Penjelasan mereka dipaparkan bersama laporan asal supaya pembaca boleh menilai sendiri.',
    keterangan_en:
      'The named party has objected to this report and provided an explanation. Their response is shown alongside the original report so readers can judge for themselves.',
    tersiar: true,
    tone: 'pertikai',
  },
};

/** Perkataan yang tidak boleh muncul sebagai label status di seluruh platform. */
export const PERKATAAN_TERLARANG = [
  'disahkan scammer',
  'confirmed scammer',
  'terbukti',
  'proven scammer',
  'bersalah',
  'guilty',
  'penjenayah',
  'criminal',
  'blacklist',
  'senarai hitam',
];

/**
 * Frasa yang menuduh secara langsung. Ia hanya boleh muncul dalam teks
 * platform jika ia dinafikan (contohnya "kami tidak melabel sesiapa sebagai
 * ‘scammer yang disahkan’"). Ujian `tests/i18n.test.ts` menguatkuasakan ini.
 */
export const FRASA_MENUDUH = [
  'disahkan scammer',
  'scammer yang disahkan',
  'disahkan penipu',
  'penipu yang disahkan',
  'confirmed scammer',
  'proven scammer',
  'terbukti bersalah',
  'senarai hitam',
  'blacklist',
];

/** Penanda yang menunjukkan frasa menuduh digunakan dalam ayat penafian. */
export const PENANDA_PENAFIAN = ['tidak', 'bukan', 'tiada', 'hanya', 'never', 'not', 'no ', 'only'];

export function statusLabel(status: ReportStatus, lang: 'ms' | 'en'): string {
  const meta = STATUS_META[status];
  return lang === 'ms' ? meta.label_ms : meta.label_en;
}

export function statusKeterangan(status: ReportStatus, lang: 'ms' | 'en'): string {
  const meta = STATUS_META[status];
  return lang === 'ms' ? meta.keterangan_ms : meta.keterangan_en;
}

/**
 * Label paparan untuk laporan yang telah disokong beberapa pelapor.
 * Kekal "dilaporkan" walau berapa ramai pun yang melapor.
 */
export function labelDenganKiraan(status: ReportStatus, bilangan: number, lang: 'ms' | 'en'): string {
  const base = statusLabel(status, lang);
  if (status !== 'dilaporkan_komuniti' || bilangan <= 1) return base;
  return `${base} (×${bilangan})`;
}

export function statusTersiar(status: ReportStatus): boolean {
  return STATUS_META[status].tersiar;
}
