import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

/**
 * Pengesahan moderator.
 *
 * Ini pengesahan mudah berasaskan token kongsi supaya papan pemuka moderasi
 * boleh dijalankan tanpa perkhidmatan luar. Untuk produksi, gantikan dengan
 * Supabase Auth / SSO organisasi anda dan simpan `moderator_id` sebenar.
 *
 * Akaun ditakrifkan melalui `MODERATOR_AKAUN`, contohnya:
 *   MODERATOR_AKAUN="aisyah:token-rahsia-1,farid:token-rahsia-2"
 *
 * Dalam produksi, tiada akaun lalai: jika pemboleh ubah tidak ditetapkan,
 * log masuk ditolak sepenuhnya.
 */

export const COOKIE_SESI = 'moderasi';
const TEMPOH_SESI_SAAT = 60 * 60 * 8;

const AKAUN_PEMBANGUNAN = 'demo:demo-token-pembangunan';

export type Moderator = { id: string };

function rahsiaSesi(): string {
  const daripadaEnv = process.env.SESSION_SECRET;
  if (daripadaEnv) return daripadaEnv;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('SESSION_SECRET wajib ditetapkan dalam produksi.');
  }
  // Pembangunan: rahsia sementara. Sesi tamat apabila pelayan dimulakan semula.
  globalThis.__rahsiaSesiDev ??= randomBytes(32).toString('hex');
  return globalThis.__rahsiaSesiDev;
}

export function menggunakanAkaunLalai(): boolean {
  return !akaunDariEnv() && process.env.NODE_ENV !== 'production';
}

/** Nilai kosong dilayan sama seperti tidak ditetapkan. */
function akaunDariEnv(): string {
  return process.env.MODERATOR_AKAUN?.trim() ?? '';
}

function senaraiAkaun(): Map<string, string> {
  const mentah = akaunDariEnv() || (menggunakanAkaunLalai() ? AKAUN_PEMBANGUNAN : '');
  const akaun = new Map<string, string>();
  for (const bahagian of mentah.split(',')) {
    const [id, token] = bahagian.split(':');
    if (id?.trim() && token?.trim()) akaun.set(id.trim(), token.trim());
  }
  return akaun;
}

export function moderasiDikonfigurasi(): boolean {
  return senaraiAkaun().size > 0;
}

function sama(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function sahkanKelayakan(id: string, token: string): boolean {
  const dijangka = senaraiAkaun().get(id.trim());
  if (!dijangka) return false;
  return sama(dijangka, token);
}

function tandatangan(muatan: string): string {
  return createHmac('sha256', rahsiaSesi()).update(muatan).digest('hex');
}

export function ciptaToken(id: string): string {
  const luput = Math.floor(Date.now() / 1000) + TEMPOH_SESI_SAAT;
  const muatan = `${encodeURIComponent(id)}.${luput}`;
  return `${muatan}.${tandatangan(muatan)}`;
}

export function bacaToken(nilai: string | undefined): Moderator | undefined {
  if (!nilai) return undefined;
  const bahagian = nilai.split('.');
  if (bahagian.length !== 3) return undefined;
  const [id, luput, tanda] = bahagian as [string, string, string];
  const muatan = `${id}.${luput}`;
  if (!sama(tandatangan(muatan), tanda)) return undefined;
  if (Number(luput) * 1000 < Date.now()) return undefined;
  return { id: decodeURIComponent(id) };
}

/** Moderator semasa, atau undefined jika belum log masuk. */
export async function moderatorSemasa(): Promise<Moderator | undefined> {
  const store = await cookies();
  return bacaToken(store.get(COOKIE_SESI)?.value);
}
