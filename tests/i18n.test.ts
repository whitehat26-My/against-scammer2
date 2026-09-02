import { describe, expect, it } from 'vitest';
import { ms } from '@/lib/dictionaries/ms';
import { en } from '@/lib/dictionaries/en';
import { LANGUAGES, dict, isLang, otherLang, pick } from '@/lib/i18n';
import { FRASA_MENUDUH, PENANDA_PENAFIAN } from '@/lib/status';
import { classifyQuery } from '@/lib/query';

function collectKeys(value: unknown, prefix = ''): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((item, i) => collectKeys(item, `${prefix}[${i}]`));
  }
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, val]) => {
      const path = prefix ? `${prefix}.${key}` : key;
      const nested = collectKeys(val, path);
      return nested.length > 0 ? nested : [path];
    });
  }
  return prefix ? [prefix] : [];
}

function collectStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(collectStrings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(collectStrings);
  return [];
}

describe('dictionary dwibahasa', () => {
  it('mempunyai struktur kunci yang sama untuk BM dan EN', () => {
    expect(collectKeys(en)).toEqual(collectKeys(ms));
  });

  it('tidak meninggalkan sebarang teks kosong', () => {
    for (const lang of LANGUAGES) {
      for (const teks of collectStrings(dict(lang))) {
        expect(teks.trim().length, `teks kosong dalam dictionary ${lang}`).toBeGreaterThan(0);
      }
    }
  });

  it('hanya menggunakan frasa menuduh dalam ayat penafian', () => {
    // Platform tidak boleh mendakwa sesiapa "disahkan scammer". Frasa itu hanya
    // dibenarkan apabila ia dinafikan, cth. "kami tidak melabel sesiapa sebagai ...".
    for (const lang of LANGUAGES) {
      for (const teks of collectStrings(dict(lang))) {
        const rendah = teks.toLowerCase();
        for (const frasa of FRASA_MENUDUH) {
          if (!rendah.includes(frasa)) continue;
          const dinafikan = PENANDA_PENAFIAN.some((penanda) => rendah.includes(penanda));
          expect(dinafikan, `dictionary ${lang}: "${frasa}" digunakan tanpa penafian dalam "${teks}"`).toBe(true);
        }
      }
    }
  });

  it('mempunyai panduan semakan untuk setiap jenis input yang mungkin', () => {
    const contoh = ['012-345 6789', '514012345678', 'contoh.xyz', 'Syarikat ABC', ''];
    for (const lang of LANGUAGES) {
      const d = dict(lang);
      for (const input of contoh) {
        const kind = classifyQuery(input).kind;
        expect(d.semak.kinds[kind], `${lang}: label untuk ${kind}`).toBeTruthy();
        expect(d.semak.panduan[kind], `${lang}: panduan untuk ${kind}`).toBeDefined();
      }
    }
  });

  it('mempunyai teks untuk setiap kod petunjuk URL', () => {
    const kod = Object.keys(ms.semak.hints.codes);
    expect(Object.keys(en.semak.hints.codes)).toEqual(kod);
    expect(kod.length).toBeGreaterThan(5);
  });
});

describe('utiliti bahasa', () => {
  it('mengenal pasti kod bahasa yang sah sahaja', () => {
    expect(isLang('ms')).toBe(true);
    expect(isLang('en')).toBe(true);
    expect(isLang('id')).toBe(false);
    expect(isLang(undefined)).toBe(false);
  });

  it('menukar antara dua bahasa', () => {
    expect(otherLang('ms')).toBe('en');
    expect(otherLang('en')).toBe('ms');
  });

  it('memilih teks mengikut bahasa', () => {
    expect(pick('ms', { ms: 'Semak', en: 'Check' })).toBe('Semak');
    expect(pick('en', { ms: 'Semak', en: 'Check' })).toBe('Check');
  });
});
