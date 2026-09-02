/**
 * Jenis data & fungsi tulen untuk modul Suapan Berita.
 *
 * Seperti `kategori.ts`, fail ini tidak menyentuh `node:fs` supaya ia selamat
 * diimport oleh komponen klien. Pemuatan Markdown ada dalam `berita.ts`.
 */

import type { Lang } from './i18n';

/**
 * `berita`  — ringkasan sesuatu kenyataan atau laporan yang diterbitkan di tempat lain.
 * `amaran`  — nota amaran evergreen yang ditulis oleh pasukan portal sendiri.
 *
 * Perbezaan ini dipaparkan kepada pembaca supaya mereka tahu sama ada sesuatu
 * entri melaporkan peristiwa, atau sekadar menerangkan sesuatu yang berterusan.
 */
export const JENIS_ARTIKEL = ['berita', 'amaran'] as const;
export type JenisArtikel = (typeof JENIS_ARTIKEL)[number];

export function isJenisArtikel(value: unknown): value is JenisArtikel {
  return typeof value === 'string' && (JENIS_ARTIKEL as readonly string[]).includes(value);
}

export type Artikel = {
  slug: string;
  tajuk: string;
  /** Ringkasan dalam ayat kami sendiri. Jangan salin teks penuh sumber. */
  ringkasan: string;
  jenis: JenisArtikel;
  /** Tag menggunakan taksonomi yang SAMA dengan ensiklopedia (slug kategori). */
  kategori_tags: string[];
  sumber_nama: string;
  sumber_url: string;
  tarikh_terbit: string;
  /** HTML konteks tambahan, ditulis oleh pasukan portal. Boleh kosong. */
  html: string;
  langSumber: Lang;
};

export type ArtikelRingkas = Omit<Artikel, 'html'>;

export function isiTerkini<T extends ArtikelRingkas>(items: T[]): T[] {
  return [...items].sort((a, b) => b.tarikh_terbit.localeCompare(a.tarikh_terbit));
}

/** Tapis artikel mengikut tag kategori dan teks carian. */
export function tapisArtikel<T extends ArtikelRingkas>(items: T[], tag: string, teks: string): T[] {
  const q = teks.trim().toLowerCase();
  return items.filter((a) => {
    if (tag && !a.kategori_tags.includes(tag)) return false;
    if (!q) return true;
    return [a.tajuk, a.ringkasan, a.sumber_nama].join(' ').toLowerCase().includes(q);
  });
}

/** Artikel yang berkongsi tag dengan sesuatu entri ensiklopedia. */
export function artikelUntukKategori<T extends ArtikelRingkas>(items: T[], slugKategori: string, had = 3): T[] {
  return isiTerkini(items.filter((a) => a.kategori_tags.includes(slugKategori))).slice(0, had);
}
