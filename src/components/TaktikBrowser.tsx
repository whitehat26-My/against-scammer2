'use client';

import Link from 'next/link';
import { useId, useMemo, useState } from 'react';
import type { ScamCategorySummary } from '@/lib/kategori';
import { searchCategories } from '@/lib/kategori';
import type { Dictionary, Lang } from '@/lib/i18n';
import {
  PLATFORMS,
  PLATFORM_LABEL,
  RISK_LABEL,
  RISK_LEVELS,
  type PlatformId,
  type RiskLevel,
} from '@/lib/taxonomy';

type Props = {
  items: ScamCategorySummary[];
  lang: Lang;
  d: Dictionary['taktik'];
  common: Dictionary['common'];
};

export function TaktikBrowser({ items, lang, d, common }: Props) {
  const [term, setTerm] = useState('');
  const [platform, setPlatform] = useState<PlatformId | ''>('');
  const [risiko, setRisiko] = useState<RiskLevel | ''>('');
  const searchId = useId();
  const platformId = useId();
  const risikoId = useId();

  const filtered = useMemo(() => {
    let list = items;
    if (platform) list = list.filter((c) => c.platform.includes(platform));
    if (risiko) list = list.filter((c) => c.risiko === risiko);
    return searchCategories(list, term);
  }, [items, platform, risiko, term]);

  const hasFilters = Boolean(term || platform || risiko);

  function clearAll() {
    setTerm('');
    setPlatform('');
    setRisiko('');
  }

  return (
    <div className="stack-lg">
      <div className="stack">
        <div className="field">
          <label className="field__label" htmlFor={searchId}>
            {common.cari}
          </label>
          <input
            id={searchId}
            className="input"
            type="search"
            autoComplete="off"
            placeholder={d.cariPlaceholder}
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          />
        </div>

        <div className="filters">
          <div className="field">
            <label className="field__label" htmlFor={platformId}>
              {d.tapisPlatform}
            </label>
            <select
              id={platformId}
              className="input"
              value={platform}
              onChange={(e) => setPlatform(e.target.value as PlatformId | '')}
            >
              <option value="">{common.semua}</option>
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>
                  {PLATFORM_LABEL[p][lang]}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label className="field__label" htmlFor={risikoId}>
              {d.tapisRisiko}
            </label>
            <select
              id={risikoId}
              className="input"
              value={risiko}
              onChange={(e) => setRisiko(e.target.value as RiskLevel | '')}
            >
              <option value="">{common.semua}</option>
              {RISK_LEVELS.map((r) => (
                <option key={r} value={r}>
                  {RISK_LABEL[r][lang]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="btnrow" style={{ alignItems: 'center' }}>
          <p className="small muted" style={{ margin: 0 }} aria-live="polite">
            {d.hasil.replace('{n}', String(filtered.length))}
          </p>
          {hasFilters ? (
            <button type="button" className="btn btn--secondary" onClick={clearAll}>
              {common.kosongkan}
            </button>
          ) : null}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card stack">
          <p style={{ marginBottom: 0 }}>{d.tiadaHasil}</p>
          <div className="btnrow">
            <button type="button" className="btn btn--secondary" onClick={clearAll}>
              {d.tiadaHasilCta}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid--2">
          {filtered.map((c) => (
            <Link key={c.slug} href={`/taktik/${c.slug}`} className="card card--link">
              <div className="chips" style={{ marginBottom: '0.6rem' }}>
                <span className={`badge badge--${c.risiko}`}>{RISK_LABEL[c.risiko][lang]}</span>
              </div>
              <h2 className="card__title">{c.nama}</h2>
              <p className="small muted" style={{ marginBottom: '0.6rem' }}>
                {c.ringkasan}
              </p>
              <ul className="chips">
                {c.platform.slice(0, 4).map((p) => (
                  <li key={p} className="chip">
                    {PLATFORM_LABEL[p][lang]}
                  </li>
                ))}
              </ul>
              <p className="card__meta">
                {common.kemasKini}: {c.kemas_kini}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
