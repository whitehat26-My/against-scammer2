import type { NextConfig } from 'next';

/**
 * Header keselamatan asas.
 * `Referrer-Policy: no-referrer` penting untuk modul Alat Semakan:
 * apabila pengguna klik keluar ke Semak Mule, laman luar tidak sepatutnya
 * menerima maklumat dari mana pengguna datang.
 */
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'no-referrer' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  /**
   * Middleware berjalan pada runtime edge, yang TIDAK mendedahkan pemboleh ubah
   * persekitaran sewenang-wenangnya semasa runtime (hanya NODE_ENV dan senarai
   * dalaman Next). Untuk membolehkan `src/middleware.ts` membaca dua nilai ini,
   * kita menyalinnya di sini supaya ia di-inline semasa binaan.
   *
   * Akibatnya kedua-duanya adalah **masa binaan**: tetapkannya semasa `next build`,
   * bukan hanya semasa `next start`. Senarai putih IP utama dikuatkuasakan di
   * Cloudflare WAF (boleh diubah semasa runtime di sana); lapisan aplikasi ini
   * ialah pertahanan tambahan untuk capaian terus ke origin.
   */
  env: {
    DI_BELAKANG_CLOUDFLARE: process.env.DI_BELAKANG_CLOUDFLARE ?? '',
    MODERATOR_IP_DIBENARKAN: process.env.MODERATOR_IP_DIBENARKAN ?? '',
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default nextConfig;
