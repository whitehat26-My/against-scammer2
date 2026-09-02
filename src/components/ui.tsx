import type { ReactNode } from 'react';
import { RISK_LABEL, PLATFORM_LABEL, type PlatformId, type RiskLevel } from '@/lib/taxonomy';
import type { Lang } from '@/lib/i18n';

export function Callout({
  title,
  tone = 'info',
  children,
}: {
  title?: string;
  tone?: 'info' | 'amaran' | 'bahaya' | 'nota';
  children: ReactNode;
}) {
  return (
    <div className={`notis notis--${tone}`}>
      {title ? <p className="notis__title">{title}</p> : null}
      {children}
    </div>
  );
}

export function RiskBadge({ risiko, lang }: { risiko: RiskLevel; lang: Lang }) {
  return <span className={`badge badge--${risiko}`}>{RISK_LABEL[risiko][lang]}</span>;
}

export function PlatformChips({ platform, lang }: { platform: PlatformId[]; lang: Lang }) {
  if (platform.length === 0) return null;
  return (
    <ul className="chips">
      {platform.map((p) => (
        <li key={p} className="chip">
          {PLATFORM_LABEL[p][lang]}
        </li>
      ))}
    </ul>
  );
}

export function ExternalLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  // rel="noreferrer" penting: laman luar tidak diberitahu dari mana pengguna datang.
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className ? `${className} ext` : 'ext'}>
      {children}
    </a>
  );
}
