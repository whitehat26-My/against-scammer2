import { describe, expect, it } from 'vitest';
import { getAllCategories, getCategory, listCategorySlugs } from '@/lib/content';
import { PLATFORMS, RISK_LEVELS } from '@/lib/taxonomy';
import { LANGUAGES } from '@/lib/i18n';

const slugs = listCategorySlugs();

describe('kandungan ensiklopedia', () => {
  it('mempunyai sekurang-kurangnya 4 kategori seperti skop MVP', () => {
    expect(slugs.length).toBeGreaterThanOrEqual(4);
  });

  it('memuatkan setiap kategori dalam kedua-dua bahasa', () => {
    for (const lang of LANGUAGES) {
      for (const slug of slugs) {
        const entry = getCategory(slug, lang);
        expect(entry, `${slug}.${lang}`).toBeDefined();
        expect(entry?.langSumber, `${slug} sepatutnya ada fail ${lang}`).toBe(lang);
      }
    }
  });

  it('mempunyai medan wajib yang lengkap dan sah', () => {
    for (const lang of LANGUAGES) {
      for (const entry of getAllCategories(lang)) {
        expect(entry.nama.length, entry.slug).toBeGreaterThan(2);
        expect(entry.ringkasan.length, entry.slug).toBeGreaterThan(20);
        expect(RISK_LEVELS).toContain(entry.risiko);
        expect(entry.platform.length, entry.slug).toBeGreaterThan(0);
        for (const p of entry.platform) expect(PLATFORMS).toContain(p);
        expect(entry.kemas_kini, entry.slug).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
    }
  });

  it('mempunyai red flag, contoh taktik dan langkah pantas untuk setiap kategori', () => {
    for (const lang of LANGUAGES) {
      for (const entry of getAllCategories(lang)) {
        expect(entry.red_flags.length, `${entry.slug}: red_flags`).toBeGreaterThanOrEqual(5);
        expect(entry.contoh_taktik.length, `${entry.slug}: contoh_taktik`).toBeGreaterThanOrEqual(2);
        expect(entry.langkah_pantas.length, `${entry.slug}: langkah_pantas`).toBeGreaterThanOrEqual(3);
        for (const contoh of entry.contoh_taktik) {
          expect(contoh.mesej.length).toBeGreaterThan(20);
          expect(contoh.kenapa_bahaya.length).toBeGreaterThan(20);
        }
      }
    }
  });

  it('menghasilkan HTML daripada badan Markdown', () => {
    for (const entry of getAllCategories('ms')) {
      expect(entry.html, entry.slug).toContain('<h2');
      expect(entry.html.length, entry.slug).toBeGreaterThan(500);
    }
  });

  it('mengekalkan taksonomi yang sama merentas bahasa untuk kegunaan pautan silang', () => {
    for (const slug of slugs) {
      const ms = getCategory(slug, 'ms');
      const en = getCategory(slug, 'en');
      expect(en?.risiko).toBe(ms?.risiko);
      expect(en?.platform).toEqual(ms?.platform);
      expect(en?.susunan).toBe(ms?.susunan);
    }
  });

  it('menolak slug yang tidak sah tanpa menyentuh sistem fail', () => {
    expect(getCategory('../../etc/passwd', 'ms')).toBeUndefined();
    expect(getCategory('tidak-wujud', 'ms')).toBeUndefined();
  });
});
