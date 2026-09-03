/**
 * Pemuat kandungan Suapan Berita.
 *
 * Sama seperti ensiklopedia: fail Markdown + frontmatter di bawah
 * `content/berita/`, satu fail per bahasa (`<slug>.ms.md`, `<slug>.en.md`),
 * dengan sandaran ke Bahasa Malaysia apabila terjemahan belum ada.
 *
 * Peraturan kandungan: ringkaskan dalam ayat sendiri dan pautkan balik ke
 * sumber asal. Jangan salin teks penuh — lihat `content/README.md`.
 */

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';
import type { Lang } from './i18n';
import { isJenisArtikel, isiTerkini, type Artikel, type ArtikelRingkas } from './artikel';
import { listCategorySlugs } from './content';

export type { Artikel, ArtikelRingkas } from './artikel';

function bacaSumber(namaFail: string): string | undefined {
  const fail = path.join(process.cwd(), 'content', 'berita', namaFail);
  try {
    return fs.readFileSync(fail, 'utf8');
  } catch {
    return undefined;
  }
}

function wajibTeks(nilai: unknown, medan: string, fail: string): string {
  if (typeof nilai !== 'string' || nilai.trim() === '') {
    throw new Error(`Artikel tidak sah dalam ${fail}: medan "${medan}" wajib diisi.`);
  }
  return nilai.trim();
}

export function listArticleSlugs(): string[] {
  const dir = path.join(process.cwd(), 'content', 'berita');
  if (!fs.existsSync(dir)) return [];

  const slugs = new Set<string>();
  for (const nama of fs.readdirSync(dir)) {
    const padanan = /^(.+)\.(ms|en)\.md$/.exec(nama);
    if (padanan?.[1]) slugs.add(padanan[1]);
  }
  return [...slugs].sort();
}

export function getArticle(slug: string, lang: Lang): Artikel | undefined {
  if (!/^[a-z0-9-]+$/.test(slug)) return undefined;

  const utama = bacaSumber(`${slug}.${lang}.md`);
  const sumber = utama ?? bacaSumber(`${slug}.ms.md`);
  if (sumber === undefined) return undefined;

  const fail = `${slug}.${utama ? lang : 'ms'}.md`;
  const { data, content } = matter(sumber);

  const jenis = wajibTeks(data.jenis, 'jenis', fail);
  if (!isJenisArtikel(jenis)) {
    throw new Error(`Artikel tidak sah dalam ${fail}: "jenis" mesti "berita" atau "amaran".`);
  }

  const sumberUrl = wajibTeks(data.sumber_url, 'sumber_url', fail);
  if (!sumberUrl.startsWith('https://')) {
    throw new Error(`Artikel tidak sah dalam ${fail}: "sumber_url" mesti bermula dengan https://.`);
  }

  const tags = Array.isArray(data.kategori_tags) ? (data.kategori_tags as unknown[]) : [];
  const kategoriSah = listCategorySlugs();
  const kategori_tags = tags.map((t) => {
    if (typeof t !== 'string' || !kategoriSah.includes(t)) {
      // Tag mesti sepadan dengan slug ensiklopedia supaya pautan silang berfungsi.
      throw new Error(`Artikel tidak sah dalam ${fail}: tag "${String(t)}" tiada dalam ensiklopedia.`);
    }
    return t;
  });

  const tarikh = wajibTeks(data.tarikh_terbit, 'tarikh_terbit', fail);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(tarikh)) {
    throw new Error(`Artikel tidak sah dalam ${fail}: "tarikh_terbit" mesti YYYY-MM-DD.`);
  }

  const ringkasan = wajibTeks(data.ringkasan, 'ringkasan', fail);
  if (ringkasan.length > 1200) {
    // Ringkasan, bukan salinan penuh.
    throw new Error(`Artikel tidak sah dalam ${fail}: "ringkasan" melebihi 1200 aksara.`);
  }

  return {
    slug,
    tajuk: wajibTeks(data.tajuk, 'tajuk', fail),
    ringkasan,
    jenis,
    kategori_tags,
    sumber_nama: wajibTeks(data.sumber_nama, 'sumber_nama', fail),
    sumber_url: sumberUrl,
    tarikh_terbit: tarikh,
    html: marked.parse(content, { async: false }),
    langSumber: utama ? lang : 'ms',
  };
}

export function getAllArticles(lang: Lang): Artikel[] {
  return isiTerkini(
    listArticleSlugs()
      .map((slug) => getArticle(slug, lang))
      .filter((a): a is Artikel => Boolean(a)),
  );
}

export function getArticleSummaries(lang: Lang): ArtikelRingkas[] {
  return getAllArticles(lang).map(({ html: _html, ...rest }) => rest);
}
