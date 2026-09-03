/**
 * Pengekstrakan IP klien sebenar daripada pengepala permintaan.
 *
 * Di belakang Cloudflare, `CF-Connecting-IP` ditetapkan oleh Cloudflare dan
 * TIDAK boleh dipalsukan oleh klien. Sebaliknya `X-Forwarded-For` boleh
 * diprakata oleh klien — jika kita mempercayainya untuk keputusan keselamatan
 * (had kadar, senarai putih IP panel admin, log audit), penyerang boleh
 * memintas senarai putih atau meracuni had kadar dengan menghantar XFF palsu.
 *
 * Apabila `DI_BELAKANG_CLOUDFLARE=1`, kita mempercayai `CF-Connecting-IP`
 * sahaja. Permintaan yang sampai tanpa pengepala itu (biasanya capaian terus
 * ke origin yang memintas Cloudflare) diberi pengenal `tempatan`, yang tidak
 * akan lulus senarai putih IP — selamat secara lalai.
 *
 * Tanpa suis itu, kita gunakan pengepala proksi biasa seperti sebelum ini.
 *
 * Fail ini mesti kekal tulen (tiada `node:*`) kerana ia diimport oleh
 * middleware yang berjalan pada runtime edge.
 */

/** Pengenal untuk permintaan tanpa IP yang boleh dipercayai. */
export const IP_TEMPATAN = 'tempatan';

export function diBelakangCloudflare(): boolean {
  return process.env.DI_BELAKANG_CLOUDFLARE === '1';
}

/**
 * IP klien sebenar untuk had kadar, senarai putih dan log audit.
 * `h` ialah pengepala permintaan (Headers).
 */
export function ipKlien(h: Headers): string {
  if (diBelakangCloudflare()) {
    const cf = h.get('cf-connecting-ip')?.trim();
    if (cf) return cf;
    // Di belakang Cloudflare tetapi tiada CF-Connecting-IP: jangan jatuh balik
    // kepada pengepala yang boleh dipalsukan untuk keputusan keselamatan.
    return IP_TEMPATAN;
  }
  const xff = h.get('x-forwarded-for')?.split(',')[0]?.trim();
  if (xff) return xff;
  const xreal = h.get('x-real-ip')?.trim();
  if (xreal) return xreal;
  return IP_TEMPATAN;
}
