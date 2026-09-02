import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { SiteFooter, SiteHeader, TopBanner } from '@/components/SiteChrome';
import { dict, getLang, htmlLang } from '@/lib/i18n';

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  const d = dict(lang);
  return {
    title: {
      default: d.meta.title,
      template: d.meta.titleTemplate,
    },
    description: d.meta.description,
    applicationName: d.meta.title,
    robots: { index: true, follow: true },
  };
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const lang = await getLang();
  const d = dict(lang);

  return (
    <html lang={htmlLang(lang)}>
      <body>
        <a className="skip-link" href="#kandungan">
          {d.nav.skip}
        </a>
        <TopBanner lang={lang} />
        <SiteHeader lang={lang} />
        <main id="kandungan">{children}</main>
        <SiteFooter lang={lang} />
      </body>
    </html>
  );
}
