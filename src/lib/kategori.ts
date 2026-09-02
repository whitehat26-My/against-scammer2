/**
 * Jenis data & fungsi tulen untuk kategori scam.
 *
 * Fail ini sengaja TIDAK menyentuh `node:fs` supaya ia selamat diimport
 * oleh komponen klien. Pemuatan fail Markdown ada dalam `content.ts`.
 */

import type { PlatformId, RiskLevel } from './taxonomy';
import type { Lang } from './i18n';

export type ContohTaktik = {
  tajuk: string;
  mesej: string;
  kenapa_bahaya: string;
};

export type ScamCategory = {
  slug: string;
  nama: string;
  ringkasan: string;
  risiko: RiskLevel;
  platform: PlatformId[];
  juga_dikenali: string[];
  red_flags: string[];
  contoh_taktik: ContohTaktik[];
  langkah_pantas: string[];
  kemas_kini: string;
  susunan: number;
  /** HTML yang telah dirender daripada badan Markdown. */
  html: string;
  /** Bahasa fail yang benar-benar digunakan (untuk notis sandaran). */
  langSumber: Lang;
};

export type ScamCategorySummary = Omit<ScamCategory, 'html' | 'contoh_taktik'>;

/** Carian teks ringkas merentas nama, ringkasan, nama lain dan red flag. */
export function searchCategories<T extends ScamCategorySummary>(items: T[], term: string): T[] {
  const q = term.trim().toLowerCase();
  if (!q) return items;
  return items.filter((c) =>
    [c.nama, c.ringkasan, ...c.juga_dikenali, ...c.red_flags].join(' ').toLowerCase().includes(q),
  );
}
