'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { isLang, LANG_COOKIE } from '@/lib/i18n';

/**
 * Tukar bahasa antara muka.
 *
 * Cookie ini hanya menyimpan 'ms' atau 'en'. Ia tidak mengandungi sebarang
 * pengenalan pengguna dan tidak digunakan untuk penjejakan.
 */
export async function setLanguage(formData: FormData): Promise<void> {
  const value = formData.get('lang');
  const next = formData.get('next');

  if (isLang(value)) {
    const store = await cookies();
    store.set(LANG_COOKIE, value, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
      httpOnly: false,
    });
  }

  // Hanya benarkan laluan dalaman untuk mengelak open redirect.
  const target = typeof next === 'string' && next.startsWith('/') && !next.startsWith('//') ? next : '/';
  redirect(target);
}
