import { cookies } from 'next/headers';
import { ms } from './dictionaries/ms';
import { en } from './dictionaries/en';

export const LANGUAGES = ['ms', 'en'] as const;
export type Lang = (typeof LANGUAGES)[number];

export const DEFAULT_LANG: Lang = 'ms';
export const LANG_COOKIE = 'bahasa';

/** Dictionary Bahasa Malaysia adalah sumber kebenaran; `en` mesti sepadan. */
export type Dictionary = typeof ms;

const DICTIONARIES: Record<Lang, Dictionary> = { ms, en };

export function isLang(value: unknown): value is Lang {
  return typeof value === 'string' && (LANGUAGES as readonly string[]).includes(value);
}

export function dict(lang: Lang): Dictionary {
  return DICTIONARIES[lang];
}

export function otherLang(lang: Lang): Lang {
  return lang === 'ms' ? 'en' : 'ms';
}

/** Kod bahasa untuk atribut <html lang>. */
export function htmlLang(lang: Lang): string {
  return lang === 'ms' ? 'ms-MY' : 'en-MY';
}

/**
 * Baca pilihan bahasa daripada cookie.
 * Cookie ini hanya menyimpan 'ms' atau 'en' — tiada pengenalan pengguna.
 */
export async function getLang(): Promise<Lang> {
  const store = await cookies();
  const value = store.get(LANG_COOKIE)?.value;
  return isLang(value) ? value : DEFAULT_LANG;
}

/** Pilih teks mengikut bahasa untuk data yang menyimpan kedua-dua versi. */
export function pick(lang: Lang, value: { ms: string; en: string }): string {
  return lang === 'ms' ? value.ms : value.en;
}
