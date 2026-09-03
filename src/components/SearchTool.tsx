'use client';

import Link from 'next/link';
import { useId, useMemo, useRef, useState } from 'react';
import { classifyQuery, type QueryKind, type QueryClassification } from '@/lib/query';
import { LaporanKomuniti } from './LaporanKomuniti';
import type { JenisKenalan } from '@/lib/laporan/types';
import { SEMAK_MULE_URL } from '@/lib/official';
import { SLUG_PAUTAN_PHISHING } from '@/lib/config';
import type { Dictionary, Lang } from '@/lib/i18n';

/** Padankan jenis input alat semakan dengan jenis kenalan dalam laporan komuniti. */
const JENIS_LAPORAN: Partial<Record<QueryKind, JenisKenalan>> = {
  telefon: 'telefon',
  akaun_bank: 'akaun_bank',
  url: 'url',
  syarikat: 'syarikat',
};

type Props = {
  d: Dictionary['semak'];
  lang: Lang;
  /** Ringkas untuk halaman utama: sembunyikan panel hasil penuh. */
  compact?: boolean;
};

/**
 * Alat semakan.
 *
 * PRIVASI: pengelasan berlaku sepenuhnya dalam pelayar. Teks carian
 * tidak dihantar ke pelayan, tidak dimasukkan ke dalam URL, dan tidak disimpan.
 */
export function SearchTool({ d, lang, compact = false }: Props) {
  const [value, setValue] = useState('');
  const [result, setResult] = useState<QueryClassification | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputId = useId();
  const resultRef = useRef<HTMLDivElement>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) {
      setError(d.kosongRalat);
      setResult(null);
      return;
    }
    setError(null);
    setResult(classifyQuery(trimmed));
    // Beri fokus kepada hasil supaya pengguna pembaca skrin tahu ia telah berubah.
    window.setTimeout(() => resultRef.current?.focus(), 0);
  }

  function handleReset() {
    setValue('');
    setResult(null);
    setError(null);
  }

  return (
    <div className="stack">
      <form onSubmit={handleSubmit} className="stack" noValidate>
        <div className="field">
          <label className="field__label" htmlFor={inputId}>
            {d.label}
          </label>
          <div className="searchbar">
            <input
              id={inputId}
              className="input"
              type="text"
              inputMode="text"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
              enterKeyHint="search"
              placeholder={d.placeholder}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              aria-describedby={`${inputId}-privasi`}
              aria-invalid={error ? true : undefined}
            />
            <button type="submit" className="btn btn--primary">
              {d.butang}
            </button>
          </div>
        </div>
        <p id={`${inputId}-privasi`} className="small muted">
          {d.privasiNota} <Link href="/privasi">{d.privasiPautan}</Link>
        </p>
        {error ? (
          <p className="small" role="alert" style={{ color: 'var(--danger)' }}>
            {error}
          </p>
        ) : null}
      </form>

      <div ref={resultRef} tabIndex={-1} aria-live="polite">
        {result ? (
          <SearchResult d={d} lang={lang} result={result} compact={compact} onReset={handleReset} />
        ) : null}
      </div>
    </div>
  );
}

function SearchResult({
  d,
  lang,
  result,
  compact,
  onReset,
}: {
  d: Dictionary['semak'];
  lang: Lang;
  result: QueryClassification;
  compact: boolean;
  onReset: () => void;
}) {
  const panduan = d.panduan[result.kind];
  // Rujukan stabil: tanpa ini, setiap render mencetuskan semakan baharu.
  const jenisLaporan = useMemo(
    () =>
      [result.kind, ...result.alternatives]
        .map((k) => JENIS_LAPORAN[k])
        .filter((j): j is JenisKenalan => Boolean(j)),
    [result],
  );

  // Di halaman utama alat ini sudah berada dalam satu panel kaca, jadi hasilnya
  // dipaparkan sebagai blok biasa supaya kaca tidak bersarang dalam kaca.
  const blok = compact ? 'blok stack' : 'panel kilau stack';

  return (
    <div className="stack-lg">
      {/* Pengenalan input dan langkah rasmi digabungkan: ia satu jawapan, bukan dua. */}
      <section className={blok}>
        <div>
          {/* Tajuk sebenar untuk struktur halaman, digayakan ringan supaya
              ia tidak menambah berat visual pada hasil. */}
          <h2 className="seksyen__eyebrow" style={{ marginBottom: '0.6rem' }}>
            {d.hasilTitle}
          </h2>
          <p className="small muted" style={{ marginBottom: '0.15rem' }}>
            {d.dikenalPastiSebagai}
          </p>
          <p style={{ fontSize: '1.15rem', fontWeight: 680, marginBottom: 0, overflowWrap: 'anywhere' }}>
            {d.kinds[result.kind]}
            {result.normalized ? <span className="muted"> — {result.normalized}</span> : null}
          </p>
          {result.alternatives.length > 0 ? (
            <p className="small muted" style={{ margin: '0.35rem 0 0' }}>
              {d.bolehJadiJuga}: {result.alternatives.map((a) => d.kinds[a]).join(', ')}
            </p>
          ) : null}
        </div>

        <hr className="pemisah" />

        <div>
          <h2 style={{ fontSize: '1.1rem' }}>{d.rasmiTitle}</h2>
          <p className="muted small">{d.rasmiLead}</p>
          <div className="btnrow">
            <a className="btn btn--primary ext" href={SEMAK_MULE_URL} target="_blank" rel="noopener noreferrer">
              {d.semakMuleCta}
            </a>
            <button type="button" className="btn btn--sunyi" onClick={onReset}>
              {d.reset}
            </button>
          </div>
          <p className="small muted" style={{ margin: '0.6rem 0 0' }}>
            {d.semakMuleNota}
          </p>
        </div>

        {panduan.length > 0 ? (
          <ul className="flaglist" style={{ marginTop: '0.25rem' }}>
            {panduan.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : null}
      </section>

      {result.kind === 'url' ? (
        <section className={blok}>
          <h2 style={{ fontSize: '1.1rem' }}>{d.hints.title}</h2>
          <p className="muted small">{d.hints.lead}</p>
          {result.urlHints.length > 0 ? (
            <ul className="flaglist">
              {result.urlHints.map((code) => (
                <li key={code}>{d.hints.codes[code]}</li>
              ))}
            </ul>
          ) : (
            <p className="muted" style={{ marginBottom: 0 }}>
              {d.hints.tiada}
            </p>
          )}
          <div className="btnrow">
            <Link className="btn btn--sunyi" href={`/taktik/${SLUG_PAUTAN_PHISHING}`}>
              {d.hints.pelajariCta} →
            </Link>
          </div>
        </section>
      ) : null}

      {!compact ? (
        <section className="panel kilau stack">
          <h2 style={{ fontSize: '1.1rem' }}>{d.komunitiTitle}</h2>
          {jenisLaporan.length > 0 ? (
            <LaporanKomuniti
              key={result.raw}
              jenis={jenisLaporan}
              nilai={result.raw}
              d={d}
              lang={lang}
            />
          ) : null}
          <div className="btnrow">
            <Link className="btn btn--secondary" href="/status-laporan">
              {d.komunitiStatusCta}
            </Link>
            <Link className="btn btn--danger" href={`/lapor?jenis=${result.kind}`}>
              {d.laporCta}
            </Link>
          </div>
          <p className="small muted" style={{ marginBottom: 0 }}>
            {d.laporNota}
          </p>
        </section>
      ) : (
        <p style={{ marginBottom: 0 }}>
          <Link className="btn btn--sunyi" href="/semak">
            {d.title} →
          </Link>
        </p>
      )}
    </div>
  );
}
