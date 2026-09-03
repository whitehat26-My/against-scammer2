/**
 * CAPTCHA untuk borang laporan komuniti.
 *
 * Penyedia disokong melalui pemboleh ubah persekitaran:
 *   CAPTCHA_PENYEDIA=turnstile   (Cloudflare Turnstile)
 *   CAPTCHA_PENYEDIA=hcaptcha
 *   CAPTCHA_KUNCI_TAPAK=...      (kunci awam, dibenamkan dalam halaman)
 *   CAPTCHA_KUNCI_RAHSIA=...     (kunci pelayan, tidak pernah dihantar ke pelayar)
 *
 * Dasar gagal-tutup: dalam produksi, jika CAPTCHA tidak dikonfigurasi, borang
 * laporan menolak penghantaran. Borang awam yang boleh dihantar tanpa had
 * adalah jemputan kepada banjir laporan palsu, dan laporan palsu pada portal
 * ini bermakna nama orang yang tidak bersalah.
 */

export type PenyediaCaptcha = 'turnstile' | 'hcaptcha';

const ENDPOINT: Record<PenyediaCaptcha, string> = {
  turnstile: 'https://challenges.cloudflare.com/turnstile/v0/siteverify',
  hcaptcha: 'https://api.hcaptcha.com/siteverify',
};

export function penyediaCaptcha(): PenyediaCaptcha | undefined {
  const nilai = process.env.CAPTCHA_PENYEDIA?.trim();
  if (nilai === 'turnstile' || nilai === 'hcaptcha') return nilai;
  return undefined;
}

export function captchaDikonfigurasi(): boolean {
  return Boolean(penyediaCaptcha() && process.env.CAPTCHA_KUNCI_TAPAK?.trim() && process.env.CAPTCHA_KUNCI_RAHSIA?.trim());
}

/**
 * CAPTCHA wajib dalam produksi.
 *
 * `CAPTCHA_TIDAK_DIPERLUKAN=1` mematikannya — satu keputusan yang disengajakan
 * untuk pemasangan di mana lapisan lain (contohnya WAF Cloudflare) sudah
 * menapis bot. Perangkap umpan, semakan masa dan had kadar tetap terpakai.
 * Papan pemuka moderasi memaparkan amaran apabila ia dimatikan.
 */
export function captchaWajib(): boolean {
  if (process.env.CAPTCHA_TIDAK_DIPERLUKAN === '1') return false;
  return process.env.NODE_ENV === 'production';
}

/** Adakah borang laporan berjalan tanpa CAPTCHA dalam produksi? */
export function captchaDimatikanSecaraSengaja(): boolean {
  return process.env.NODE_ENV === 'production' && process.env.CAPTCHA_TIDAK_DIPERLUKAN === '1' && !captchaDikonfigurasi();
}

export function kunciTapakCaptcha(): string | undefined {
  return captchaDikonfigurasi() ? process.env.CAPTCHA_KUNCI_TAPAK?.trim() : undefined;
}

export type HasilCaptcha = 'lulus' | 'gagal' | 'belum-dikonfigurasi';

export async function sahkanCaptcha(token: string, ip: string | undefined): Promise<HasilCaptcha> {
  const penyedia = penyediaCaptcha();
  if (!penyedia || !captchaDikonfigurasi()) return 'belum-dikonfigurasi';
  if (!token) return 'gagal';

  const badan = new URLSearchParams({
    secret: process.env.CAPTCHA_KUNCI_RAHSIA as string,
    response: token,
  });
  if (ip) badan.set('remoteip', ip);

  try {
    const res = await fetch(ENDPOINT[penyedia], {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: badan,
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return 'gagal';
    const data = (await res.json()) as { success?: boolean };
    return data.success === true ? 'lulus' : 'gagal';
  } catch {
    // Penyedia tidak dapat dihubungi: gagal-tutup, bukan gagal-buka.
    return 'gagal';
  }
}

/**
 * Perangkap ringkas yang berfungsi tanpa penyedia luar.
 *
 *  - Medan umpan (honeypot) yang disembunyikan daripada manusia. Bot yang
 *    mengisi semua medan akan mengisinya juga.
 *  - Semakan masa: borang yang dihantar dalam masa kurang 3 saat selepas
 *    dimuatkan hampir pasti bukan manusia yang menulis satu laporan.
 */
export const MASA_MINIMUM_MS = 3000;

export function perangkapDilanggar(umpan: string, dimuatPada: number, sekarang = Date.now()): boolean {
  if (umpan.trim() !== '') return true;
  if (!Number.isFinite(dimuatPada) || dimuatPada <= 0) return true;
  return sekarang - dimuatPada < MASA_MINIMUM_MS;
}
