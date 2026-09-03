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
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default nextConfig;
