'use client';

import { usePathname } from 'next/navigation';
import { setLanguage } from '@/app/actions';
import type { Lang } from '@/lib/i18n';

type Props = {
  lang: Lang;
  labels: { label: string; ms: string; en: string; switchTo: string };
};

/**
 * Toggle bahasa. Menggunakan <form> sebenar supaya ia tetap berfungsi
 * walaupun JavaScript gagal dimuatkan.
 */
export function LanguageToggle({ lang, labels }: Props) {
  const pathname = usePathname();

  return (
    <form action={setLanguage} className="langtoggle" aria-label={labels.label}>
      <input type="hidden" name="next" value={pathname} />
      <button type="submit" name="lang" value="ms" aria-pressed={lang === 'ms'}>
        {labels.ms}
      </button>
      <button type="submit" name="lang" value="en" aria-pressed={lang === 'en'}>
        {labels.en}
      </button>
    </form>
  );
}
