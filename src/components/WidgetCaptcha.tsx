'use client';

import Script from 'next/script';

/**
 * Widget CAPTCHA. Dirender hanya apabila satu penyedia dikonfigurasi —
 * lihat `src/lib/captcha.ts`.
 *
 * Kedua-dua penyedia menggunakan rendering tersirat: skrip mencari elemen
 * dengan kelas yang betul dan menyuntik medan tersembunyi yang dibaca oleh
 * server action.
 */
export function WidgetCaptcha({
  penyedia,
  kunciTapak,
  label,
}: {
  penyedia: 'turnstile' | 'hcaptcha';
  kunciTapak: string;
  label: string;
}) {
  const src =
    penyedia === 'turnstile'
      ? 'https://challenges.cloudflare.com/turnstile/v0/api.js'
      : 'https://js.hcaptcha.com/1/api.js';

  return (
    <div className="field">
      <span className="field__label">{label}</span>
      <Script src={src} strategy="lazyOnload" />
      <div
        className={penyedia === 'turnstile' ? 'cf-turnstile' : 'h-captcha'}
        data-sitekey={kunciTapak}
        data-theme="auto"
      />
    </div>
  );
}
