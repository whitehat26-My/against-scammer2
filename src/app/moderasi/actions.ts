'use server';

import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getStore } from '@/lib/laporan/store';
import { isTindakanModerator } from '@/lib/laporan/types';
import { ciptaToken, COOKIE_SESI, moderatorSemasa, sahkanKelayakan } from '@/lib/moderator';
import { hadKadar } from '@/lib/rate-limit';

export type KeadaanMasuk = { gagal?: boolean };

export async function logMasuk(_sebelum: KeadaanMasuk, data: FormData): Promise<KeadaanMasuk> {
  const id = String(data.get('id') ?? '');
  const token = String(data.get('token') ?? '');

  const h = await headers();
  const pengenal = h.get('x-forwarded-for')?.split(',')[0]?.trim() || 'tempatan';
  // Hadkan cubaan meneka token.
  if (!hadKadar(`masuk:${pengenal}`, 10, 15 * 60).dibenarkan) return { gagal: true };

  if (!id || !token || !sahkanKelayakan(id, token)) return { gagal: true };

  const store = await cookies();
  store.set(COOKIE_SESI, ciptaToken(id), {
    path: '/',
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 8,
  });
  redirect('/moderasi');
}

export async function logKeluar(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_SESI);
  redirect('/moderasi');
}

export async function tindakanModerasi(data: FormData): Promise<void> {
  const moderator = await moderatorSemasa();
  if (!moderator) redirect('/moderasi');

  const laporanId = String(data.get('laporan_id') ?? '');
  const tindakan = String(data.get('tindakan') ?? '');
  const sebabMentah = String(data.get('sebab') ?? '').trim();
  if (!laporanId || !isTindakanModerator(tindakan)) return;

  const store = await getStore();
  await store.tindakanModerator({
    laporan_id: laporanId,
    tindakan,
    moderator_id: moderator.id,
    sebab: sebabMentah === '' ? null : sebabMentah.slice(0, 500),
  });

  revalidatePath('/moderasi');
  revalidatePath(`/laporan/${laporanId}`);
}
