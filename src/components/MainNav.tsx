'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Ikon } from './Ikon';

export type NavItem = {
  href: string;
  label: string;
  /** Label ringkas untuk bar navigasi bawah pada telefon. */
  labelPendek?: string;
  ikon?: 'utama' | 'taktik' | 'semak' | 'lapor' | 'bantuan';
};

type ItemBawah = NavItem & { ikon: NonNullable<NavItem['ikon']> };

function aktif(pathname: string, href: string): boolean {
  return href === '/' ? pathname === '/' : pathname.startsWith(href);
}

/** Navigasi mendatar dalam pengepala. Tersembunyi pada skrin kecil. */
export function MainNav({ items, label }: { items: NavItem[]; label: string }) {
  const pathname = usePathname();
  return (
    <nav className="nav" aria-label={label}>
      {items.map((item) => (
        <Link key={item.href} href={item.href} aria-current={aktif(pathname, item.href) ? 'page' : undefined}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

/**
 * Navigasi bawah untuk telefon.
 * Ia menggantikan baris nav yang dahulunya menolak kandungan jauh ke bawah.
 */
export function BottomNav({ items, label }: { items: ItemBawah[]; label: string }) {
  const pathname = usePathname();
  return (
    <div className="bottomnav">
      <nav className="bottomnav__bar" aria-label={label}>
        {items.map((item) => (
          <Link key={item.href} href={item.href} aria-current={aktif(pathname, item.href) ? 'page' : undefined}>
            <Ikon nama={item.ikon} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
