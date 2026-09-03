import { NextResponse, type NextRequest } from 'next/server';
import { ipKlien } from '@/lib/ip';

/**
 * Lapisan perimeter: HTTPS wajib, dasar keselamatan kandungan, dan sekatan IP
 * untuk panel moderasi.
 *
 * Middleware berjalan pada runtime edge, jadi ia tidak boleh menggunakan modul
 * `node:*`. Had kadar dan enkripsi dikendalikan dalam pengendali laluan.
 */

const PRODUKSI = process.env.NODE_ENV === 'production';

/** Laluan yang hanya boleh dicapai dari IP yang disenarai putih (jika ditetapkan). */
const LALUAN_ADMIN = ['/moderasi', '/api/bukti'];

function senaraiIpDibenarkan(): string[] {
  return (process.env.MODERATOR_IP_DIBENARKAN ?? '')
    .split(',')
    .map((ip) => ip.trim())
    .filter(Boolean);
}

function dasarKandungan(nonce: string): string {
  const arahan = [
    "default-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    // Gaya sebaris diperlukan oleh Next dan oleh prop `style` React.
    // Skrip sebaris TIDAK dibenarkan — hanya skrip dengan nonce ini.
    "style-src 'self' 'unsafe-inline'",
    // Frame untuk widget CAPTCHA (Turnstile / hCaptcha) apabila dikonfigurasi.
    "frame-src 'self' https://challenges.cloudflare.com https://newassets.hcaptcha.com https://hcaptcha.com",
    PRODUKSI
      ? `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://challenges.cloudflare.com https://js.hcaptcha.com`
      : `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-eval' https://challenges.cloudflare.com https://js.hcaptcha.com`,
    "connect-src 'self' https://challenges.cloudflare.com https://api.hcaptcha.com",
    'upgrade-insecure-requests',
  ];
  return arahan.join('; ');
}

export function middleware(request: NextRequest): NextResponse {
  // 1. Paksa HTTPS. Di belakang proksi, skema sebenar ada dalam x-forwarded-proto.
  //
  //    Hidup secara lalai dalam produksi. Tetapkan `PAKSA_HTTPS=0` untuk
  //    pemasangan di mana proksi hadapan sudah mengendalikan pengalihan, atau
  //    untuk menguji binaan produksi secara tempatan tanpa TLS — tanpa suis ini
  //    proksi yang tidak menetapkan x-forwarded-proto boleh menyebabkan gelung.
  const paksaHttps = PRODUKSI && process.env.PAKSA_HTTPS !== '0';
  if (paksaHttps && request.headers.get('x-forwarded-proto') === 'http') {
    const url = request.nextUrl.clone();
    url.protocol = 'https:';
    return NextResponse.redirect(url, 308);
  }

  // 2. Senarai putih IP untuk panel moderasi, jika dikonfigurasi.
  const dibenarkan = senaraiIpDibenarkan();
  const laluanAdmin = LALUAN_ADMIN.some((l) => request.nextUrl.pathname.startsWith(l));
  if (dibenarkan.length > 0 && laluanAdmin && !dibenarkan.includes(ipKlien(request.headers))) {
    return new NextResponse('Tidak dibenarkan.', { status: 403, headers: { 'content-type': 'text/plain; charset=utf-8' } });
  }

  // 3. Nonce untuk CSP. Next menggunakannya secara automatik untuk skripnya
  //    apabila ia hadir dalam pengepala CSP.
  const nonce = btoa(crypto.randomUUID());
  const pengepalaPermintaan = new Headers(request.headers);
  pengepalaPermintaan.set('x-nonce', nonce);

  const respons = NextResponse.next({ request: { headers: pengepalaPermintaan } });
  respons.headers.set('Content-Security-Policy', dasarKandungan(nonce));
  if (PRODUKSI) {
    respons.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  }
  return respons;
}

export const config = {
  matcher: [
    /*
     * Semua laluan kecuali aset statik Next dan favicon — aset itu tidak
     * memerlukan nonce dan melangkaunya mengelakkan kerja yang sia-sia.
     */
    { source: '/((?!_next/static|_next/image|icon.svg|favicon.ico).*)' },
  ],
};
