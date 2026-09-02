import Link from 'next/link';
import { LanguageToggle } from './LanguageToggle';
import { MainNav } from './MainNav';
import { dict, type Lang } from '@/lib/i18n';
import { DISEMAK_PADA, SEMAK_MULE_URL } from '@/lib/official';

export function TopBanner({ lang }: { lang: Lang }) {
  const d = dict(lang);
  return (
    <div className="topbanner">
      <div className="container topbanner__inner">
        <span>{d.banner.text}</span>
        <a href={SEMAK_MULE_URL} target="_blank" rel="noopener noreferrer" className="ext">
          {d.banner.cta}
        </a>
        <a className="topbanner__urgent" href="tel:997">
          {d.banner.urgent}
        </a>
      </div>
    </div>
  );
}

export function SiteHeader({ lang }: { lang: Lang }) {
  const d = dict(lang);
  const items = [
    { href: '/', label: d.nav.home },
    { href: '/taktik', label: d.nav.taktik },
    { href: '/semak', label: d.nav.semak },
    { href: '/kalau-dah-kena', label: d.nav.bantuan },
    { href: '/tentang', label: d.nav.tentang },
  ];

  return (
    <header className="header">
      <div className="container header__inner">
        <Link href="/" className="brand">
          <span className="brand__mark" aria-hidden="true">
            ✓
          </span>
          <span>{d.meta.title}</span>
        </Link>
        <LanguageToggle lang={lang} labels={d.lang} />
        <MainNav items={items} label={d.nav.menu} />
      </div>
    </header>
  );
}

export function SiteFooter({ lang }: { lang: Lang }) {
  const d = dict(lang);
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__cols">
          <div>
            <h2>{d.meta.title}</h2>
            <ul className="stack">
              <li>
                <Link href="/tentang">{d.footer.tentang}</Link>
              </li>
              <li>
                <Link href="/status-laporan">{d.footer.status}</Link>
              </li>
            </ul>
          </div>
          <div>
            <h2>{d.footer.privasi}</h2>
            <ul className="stack">
              <li>
                <Link href="/privasi">{d.footer.privasi}</Link>
              </li>
              <li>
                <Link href="/hak-menjawab">{d.footer.hakMenjawab}</Link>
              </li>
            </ul>
          </div>
          <div>
            <h2>{d.footer.saluranRasmi}</h2>
            <ul className="stack">
              <li>
                <a href={SEMAK_MULE_URL} target="_blank" rel="noopener noreferrer" className="ext">
                  Semak Mule (PDRM)
                </a>
              </li>
              <li>
                <a href="tel:997">NSRC 997</a>
              </li>
              <li>
                <Link href="/kalau-dah-kena">{d.nav.bantuan}</Link>
              </li>
            </ul>
          </div>
        </div>
        <p className="footer__legal">
          {d.footer.penafian} {d.footer.disemakPada} {DISEMAK_PADA}. {d.footer.hakCipta}
        </p>
      </div>
    </footer>
  );
}
