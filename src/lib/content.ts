/**
 * Pemuat kandungan Ensiklopedia.
 *
 * Kandungan disimpan sebagai fail Markdown + frontmatter di bawah `content/taktik/`
 * supaya pasukan kandungan boleh menambah / mengemas kini entri tanpa menyentuh kod.
 * Setiap kategori ada satu fail per bahasa: `<slug>.ms.md` dan `<slug>.en.md`.
 * Jika versi bahasa Inggeris belum ada, versi Bahasa Malaysia digunakan sebagai sandaran.
 */

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';
import type { Lang } from './i18n';
import { isPlatformId, isRiskLevel, type PlatformId } from './taxonomy';
import type { ContohTaktik, ScamCategory, ScamCategorySummary } from './kategori';

export type { ContohTaktik, ScamCategory, ScamCategorySummary } from './kategori';

/**
 * Laluan kandungan dibina secara inline pada setiap panggilan `fs` supaya
 * penganalisis statik Turbopack nampak ia terhad kepada folder `content/taktik`
 * sahaja, dan tidak menjejak keseluruhan projek ke dalam output pelayan.
 */


marked.setOptions({ gfm: true, breaks: false });

/**
 * Jadual dalam kandungan Markdown dibalut supaya ia boleh ditatal secara
 * mendatar pada telefon, dan bukan memaksa keseluruhan halaman menatal.
 */
function balutJadual(html: string): string {
  return html.replace(/<table>/g, '<div class="tablewrap"><table>').replace(/<\/table>/g, '</table></div>');
}

function asStringArray(value: unknown, field: string, file: string): string[] {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value) || value.some((v) => typeof v !== 'string')) {
    throw new Error(`Kandungan tidak sah dalam ${file}: medan "${field}" mesti senarai teks.`);
  }
  return value as string[];
}

function requireString(value: unknown, field: string, file: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`Kandungan tidak sah dalam ${file}: medan "${field}" wajib diisi.`);
  }
  return value.trim();
}

function parseContohTaktik(value: unknown, file: string): ContohTaktik[] {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value)) {
    throw new Error(`Kandungan tidak sah dalam ${file}: "contoh_taktik" mesti senarai.`);
  }
  return value.map((item, i) => {
    const row = item as Record<string, unknown>;
    return {
      tajuk: requireString(row?.tajuk, `contoh_taktik[${i}].tajuk`, file),
      mesej: requireString(row?.mesej, `contoh_taktik[${i}].mesej`, file),
      kenapa_bahaya: requireString(row?.kenapa_bahaya, `contoh_taktik[${i}].kenapa_bahaya`, file),
    };
  });
}

function readSource(fileName: string): string | undefined {
  const file = path.join(process.cwd(), 'content', 'taktik', fileName);
  try {
    return fs.readFileSync(file, 'utf8');
  } catch {
    return undefined;
  }
}

function readFileFor(slug: string, lang: Lang): { file: string; source: string; langSumber: Lang } | undefined {
  const preferred = `${slug}.${lang}.md`;
  const preferredSource = readSource(preferred);
  if (preferredSource !== undefined) return { file: preferred, source: preferredSource, langSumber: lang };

  const fallback = `${slug}.ms.md`;
  const fallbackSource = readSource(fallback);
  if (fallbackSource !== undefined) return { file: fallback, source: fallbackSource, langSumber: 'ms' };

  return undefined;
}

export function listCategorySlugs(): string[] {
  const dir = path.join(process.cwd(), 'content', 'taktik');
  if (!fs.existsSync(dir)) return [];

  const slugs = new Set<string>();
  for (const name of fs.readdirSync(dir)) {
    const match = /^(.+)\.(ms|en)\.md$/.exec(name);
    if (match?.[1]) slugs.add(match[1]);
  }
  return [...slugs].sort();
}

export function getCategory(slug: string, lang: Lang): ScamCategory | undefined {
  if (!/^[a-z0-9-]+$/.test(slug)) return undefined;
  const found = readFileFor(slug, lang);
  if (!found) return undefined;

  const { data, content } = matter(found.source);
  const file = found.file;

  const risiko = requireString(data.risiko, 'risiko', file);
  if (!isRiskLevel(risiko)) {
    throw new Error(`Kandungan tidak sah dalam ${file}: "risiko" tidak dikenali (${risiko}).`);
  }

  const platform = asStringArray(data.platform, 'platform', file).filter((p) => {
    if (!isPlatformId(p)) throw new Error(`Kandungan tidak sah dalam ${file}: platform "${p}" tiada dalam taksonomi.`);
    return true;
  }) as PlatformId[];

  return {
    slug,
    nama: requireString(data.nama, 'nama', file),
    ringkasan: requireString(data.ringkasan, 'ringkasan', file),
    risiko,
    platform,
    juga_dikenali: asStringArray(data.juga_dikenali, 'juga_dikenali', file),
    red_flags: asStringArray(data.red_flags, 'red_flags', file),
    contoh_taktik: parseContohTaktik(data.contoh_taktik, file),
    langkah_pantas: asStringArray(data.langkah_pantas, 'langkah_pantas', file),
    kemas_kini: requireString(data.kemas_kini ?? '', 'kemas_kini', file),
    susunan: typeof data.susunan === 'number' ? data.susunan : 99,
    html: balutJadual(marked.parse(content, { async: false })),
    langSumber: found.langSumber,
  };
}

export function getAllCategories(lang: Lang): ScamCategory[] {
  return listCategorySlugs()
    .map((slug) => getCategory(slug, lang))
    .filter((c): c is ScamCategory => Boolean(c))
    .sort((a, b) => a.susunan - b.susunan || a.nama.localeCompare(b.nama));
}

export function getCategorySummaries(lang: Lang): ScamCategorySummary[] {
  return getAllCategories(lang).map(({ html: _html, contoh_taktik: _contoh, ...rest }) => rest);
}
