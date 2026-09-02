import { describe, expect, it } from 'vitest';
import { getAllArticles, getArticle, getArticleSummaries, listArticleSlugs } from '@/lib/berita';
import { artikelUntukKategori, isiTerkini, JENIS_ARTIKEL, tapisArtikel } from '@/lib/artikel';
import { listCategorySlugs } from '@/lib/content';
import { LANGUAGES } from '@/lib/i18n';
import { emelSah, normalkanEmel, tokenSah } from '@/lib/digest';

const slugs = listArticleSlugs();

describe('kandungan suapan berita', () => {
  it('mempunyai entri dalam kedua-dua bahasa', () => {
    expect(slugs.length).toBeGreaterThan(0);
    for (const lang of LANGUAGES) {
      for (const slug of slugs) {
        const artikel = getArticle(slug, lang);
        expect(artikel, `${slug}.${lang}`).toBeDefined();
        expect(artikel?.langSumber).toBe(lang);
      }
    }
  });

  it('setiap entri memautkan balik ke sumber https', () => {
    for (const lang of LANGUAGES) {
      for (const a of getAllArticles(lang)) {
        expect(a.sumber_url.startsWith('https://'), `${a.slug}: ${a.sumber_url}`).toBe(true);
        expect(a.sumber_nama.length).toBeGreaterThan(2);
        expect(JENIS_ARTIKEL).toContain(a.jenis);
        expect(a.tarikh_terbit).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
    }
  });

  it('ringkasan cukup panjang untuk berguna tetapi bukan salinan penuh', () => {
    for (const a of getAllArticles('ms')) {
      expect(a.ringkasan.length, a.slug).toBeGreaterThan(60);
      expect(a.ringkasan.length, a.slug).toBeLessThanOrEqual(1200);
    }
  });

  it('semua tag wujud dalam taksonomi ensiklopedia supaya pautan silang berfungsi', () => {
    const kategori = listCategorySlugs();
    for (const lang of LANGUAGES) {
      for (const a of getAllArticles(lang)) {
        expect(a.kategori_tags.length, a.slug).toBeGreaterThan(0);
        for (const tag of a.kategori_tags) expect(kategori, `${a.slug}: ${tag}`).toContain(tag);
      }
    }
  });

  it('menggunakan taksonomi yang sama merentas bahasa', () => {
    for (const slug of slugs) {
      const ms = getArticle(slug, 'ms');
      const en = getArticle(slug, 'en');
      expect(en?.kategori_tags).toEqual(ms?.kategori_tags);
      expect(en?.jenis).toBe(ms?.jenis);
      expect(en?.sumber_url).toBe(ms?.sumber_url);
      expect(en?.tarikh_terbit).toBe(ms?.tarikh_terbit);
    }
  });

  it('menolak slug yang tidak sah', () => {
    expect(getArticle('../../etc/passwd', 'ms')).toBeUndefined();
    expect(getArticle('tidak-wujud', 'ms')).toBeUndefined();
  });
});

describe('penapisan suapan', () => {
  const items = getArticleSummaries('ms');

  it('menyusun terkini dahulu', () => {
    const tarikh = isiTerkini(items).map((a) => a.tarikh_terbit);
    expect([...tarikh].sort((a, b) => b.localeCompare(a))).toEqual(tarikh);
  });

  it('menapis mengikut tag kategori', () => {
    const tag = items[0]?.kategori_tags[0] as string;
    const hasil = tapisArtikel(items, tag, '');
    expect(hasil.length).toBeGreaterThan(0);
    expect(hasil.every((a) => a.kategori_tags.includes(tag))).toBe(true);
  });

  it('menapis mengikut teks tajuk atau sumber', () => {
    expect(tapisArtikel(items, '', 'semak mule').length).toBeGreaterThan(0);
    expect(tapisArtikel(items, '', 'zzzzz-tiada')).toHaveLength(0);
  });

  it('mengembalikan artikel berkaitan untuk sesuatu kategori', () => {
    const berkaitan = artikelUntukKategori(items, 'macau-scam');
    expect(berkaitan.length).toBeGreaterThan(0);
    expect(berkaitan.every((a) => a.kategori_tags.includes('macau-scam'))).toBe(true);
    expect(artikelUntukKategori(items, 'macau-scam', 1)).toHaveLength(1);
  });
});

describe('langganan digest', () => {
  it('menerima alamat e-mel yang munasabah sahaja', () => {
    expect(emelSah('orang@contoh.my')).toBe(true);
    expect(emelSah('orang@contoh')).toBe(false);
    expect(emelSah('bukan-emel')).toBe(false);
    expect(emelSah(`${'a'.repeat(250)}@contoh.my`)).toBe(false);
  });

  it('menormalkan alamat supaya satu orang tidak boleh melanggan berkali-kali', () => {
    expect(normalkanEmel('  Orang@Contoh.MY ')).toBe('orang@contoh.my');
  });

  it('hanya menerima token berbentuk UUID', () => {
    expect(tokenSah('3f2504e0-4f89-11d3-9a0c-0305e82c3301')).toBe(true);
    expect(tokenSah('token-palsu')).toBe(false);
    expect(tokenSah('')).toBe(false);
  });
});
