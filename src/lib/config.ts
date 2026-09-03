/**
 * Tetapan yang perlu ditukar sebelum pelancaran sebenar.
 * Ditempatkan di satu fail supaya mudah dijumpai semasa penyediaan.
 */

/** Alamat e-mel untuk hak menjawab & permintaan PDPA. GANTIKAN sebelum lancar. */
export const KONTAK_EMEL = process.env.NEXT_PUBLIC_KONTAK_EMEL ?? 'privasi@contoh-portal-scam.my';

/** Tarikh notis privasi terakhir dikemas kini. */
export const PRIVASI_KEMAS_KINI = '2026-08-15';

/** URL kanonik laman (untuk sitemap & robots). */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://contoh-portal-scam.my';

/**
 * Slug entri ensiklopedia yang dirujuk secara langsung oleh kod.
 * Ujian `tests/content.test.ts` memastikan entri ini benar-benar wujud.
 */
export const SLUG_PAUTAN_PHISHING = 'pautan-phishing';
