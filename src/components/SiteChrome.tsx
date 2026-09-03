import Link from 'next/link';
import { LanguageToggle } from './LanguageToggle';
import { BottomNav, MainNav, type NavItem } from './MainNav';
import { dict, type Lang } from '@/lib/i18n';
import { DISEMAK_PADA, SEMAK_MULE_URL } from '@/lib/official';

function itemNav(lang: Lang): NavItem[] {
  const d = dict(lang);
  return [
    { href: '/', label: d.nav.home, ikon: 'utama' },
    { href: '/taktik', label: d.nav.taktik, labelPendek: d.nav.taktikPendek, ikon: 'taktik' },
    { href: '/semak', label: d.nav.semak, ikon: 'semak' },
    { href: '/lapor', label: d.nav.lapor, ikon: 'lapor' },
    { href: '/kalau-dah-kena', label: d.nav.bantuan, labelPendek: d.nav.bantuanPendek, ikon: 'bantuan' },
    { href: '/berita', label: d.nav.berita },
    { href: '/tentang', label: d.nav.tentang },
  ];
}

export function SiteHeader({ lang }: { lang: Lang }) {
  const d = dict(lang);
  const items = itemNav(lang);

  return (
    <header className="header">
      <div className="container">
        <div className="header__bar">
          <div className="header__utama">
            <Link href="/" className="brand">
            <span className="brand__mark" aria-hidden="true">
              ✓
            </span>
            <span className="brand__teks">{d.meta.title}</span>
              <span className="brand__pendek">{d.meta.titlePendek}</span>
            </Link>
            <MainNav items={items} label={d.nav.menu} />
            <div className="header__kanan">
              <LanguageToggle lang={lang} labels={d.lang} />
            </div>
          </div>

          {/* Notis undang-undang kekal pada setiap halaman, tetapi sebaris sahaja. */}
          <p className="notis-rasmi">
            <span>{d.banner.text}</span>
            <a href={SEMAK_MULE_URL} target="_blank" rel="noopener noreferrer" className="ext">
              {d.banner.cta}
            </a>
            <a className="notis-rasmi__urgent" href="tel:997">
              {d.banner.urgent}
            </a>
          </p>
        </div>
      </div>
    </header>
  );
}

export function SiteBottomNav({ lang }: { lang: Lang }) {
  const d = dict(lang);
  const items = itemNav(lang)
    .filter((i) => Boolean(i.ikon))
    .map((i) => ({ ...i, ikon: i.ikon as NonNullable<NavItem['ikon']>, label: i.labelPendek ?? i.label }));
  return <BottomNav items={items} label={d.nav.menu} />;
}

export function SiteFooter({ lang }: { lang: Lang }) {
  const d = dict(lang);
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__kaca">
          <div className="footer__cols">
            <div>
              <h2>{d.meta.title}</h2>
              <ul>
                <li>
                  <Link href="/tentang">{d.footer.tentang}</Link>
                </li>
                <li>
                  <Link href="/status-laporan">{d.footer.status}</Link>
                </li>
                <li>
                  <Link href="/lapor">{d.nav.lapor}</Link>
                </li>
                <li>
                  <Link href="/berita">{d.nav.berita}</Link>
                </li>
              </ul>
            </div>
            <div>
              <h2>{d.footer.privasi}</h2>
              <ul>
                <li>
                  <Link href="/privasi">{d.footer.privasi}</Link>
                </li>
                <li>
                  <Link href="/hak-menjawab">{d.footer.hakMenjawab}</Link>
                </li>
                <li>
                  <Link href="/moderasi">{d.nav.moderasi}</Link>
                </li>
              </ul>
            </div>
            <div>
              <h2>{d.footer.saluranRasmi}</h2>
              <ul>
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
      </div>
    </footer>
  );
}
