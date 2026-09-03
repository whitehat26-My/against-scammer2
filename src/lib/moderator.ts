import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { sahkanTotp } from './totp';

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
/**
 * Sesi tamat selepas 4 jam. Ia disegarkan pada setiap permintaan yang
 * disahkan, jadi kerja berterusan tidak terputus, tetapi sesi yang ditinggalkan
 * pada peranti berkongsi akan luput.
 */
const TEMPOH_SESI_SAAT = 60 * 60 * 4;

/** Panjang minimum token moderator. Token pendek boleh diteka. */
export const PANJANG_TOKEN_MINIMUM = 24;

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

/**
 * Rahsia TOTP setiap moderator, contohnya:
 *   MODERATOR_TOTP="aisyah:JBSWY3DPEHPK3PXP,farid:KRSXG5CTMVRXEZLU"
 *
 * Jika satu akaun mempunyai rahsia, kod TOTP WAJIB untuk akaun itu.
 */
function rahsiaTotp(): Map<string, string> {
  const peta = new Map<string, string>();
  for (const bahagian of (process.env.MODERATOR_TOTP ?? '').split(',')) {
    const [id, rahsia] = bahagian.split(':');
    if (id?.trim() && rahsia?.trim()) peta.set(id.trim(), rahsia.trim());
  }
  return peta;
}

export function totpDiperlukan(id: string): boolean {
  return rahsiaTotp().has(id.trim());
}

/** Adakah setiap akaun yang dikonfigurasi mempunyai TOTP? */
export function mfaLengkap(): boolean {
  const akaun = [...senaraiAkaun().keys()];
  const totp = rahsiaTotp();
  return akaun.length > 0 && akaun.every((id) => totp.has(id));
}

/** Akaun dengan token yang terlalu pendek untuk selamat. */
export function akaunTokenLemah(): string[] {
  return [...senaraiAkaun().entries()]
    .filter(([, token]) => token.length < PANJANG_TOKEN_MINIMUM)
    .map(([id]) => id);
}

export function sahkanTotpModerator(id: string, kod: string): boolean {
  const rahsia = rahsiaTotp().get(id.trim());
  if (!rahsia) return true; // Tiada TOTP dikonfigurasi untuk akaun ini.
  return sahkanTotp(rahsia, kod);
}

function tandatangan(muatan: string): string {
  return createHmac('sha256', rahsiaSesi()).update(muatan).digest('hex');
}

/**
 * Token pra-sesi untuk langkah kedua log masuk.
 *
 * Selepas faktor pertama betul, pelayan mengeluarkan token bertandatangan
 * berumur pendek. Borang menghantarnya semula bersama kod TOTP, jadi token
 * moderator tidak perlu ditaip atau disimpan dalam DOM buat kali kedua.
 *
 * Awalan "pra" memastikan ia tidak boleh diterima sebagai kuki sesi penuh.
 */
const TEMPOH_PRA_SESI_SAAT = 5 * 60;

export function ciptaPraSesi(id: string): string {
  const luput = Math.floor(Date.now() / 1000) + TEMPOH_PRA_SESI_SAAT;
  const muatan = `pra.${encodeURIComponent(id)}.${luput}`;
  return `${muatan}.${tandatangan(muatan)}`;
}

export function bacaPraSesi(nilai: string | undefined): string | undefined {
  if (!nilai) return undefined;
  const bahagian = nilai.split('.');
  if (bahagian.length !== 4 || bahagian[0] !== 'pra') return undefined;
  const [awalan, id, luput, tanda] = bahagian as [string, string, string, string];
  const muatan = `${awalan}.${id}.${luput}`;
  if (!sama(tandatangan(muatan), tanda)) return undefined;
  if (Number(luput) * 1000 < Date.now()) return undefined;
  return decodeURIComponent(id);
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
