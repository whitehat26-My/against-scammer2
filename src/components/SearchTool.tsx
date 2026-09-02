'use client';

import Link from 'next/link';
import { useId, useRef, useState } from 'react';
import { classifyQuery, type QueryClassification } from '@/lib/query';
import { SEMAK_MULE_URL } from '@/lib/official';
import type { Dictionary } from '@/lib/i18n';

type Props = {
  d: Dictionary['semak'];
  /** Ringkas untuk halaman utama: sembunyikan panel hasil penuh. */
  compact?: boolean;
};

/**
 * Alat semakan.
 *
 * PRIVASI: pengelasan berlaku sepenuhnya dalam pelayar. Teks carian
 * tidak dihantar ke pelayan, tidak dimasukkan ke dalam URL, dan tidak disimpan.
 */
export function SearchTool({ d, compact = false }: Props) {
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
        {result ? <SearchResult d={d} result={result} compact={compact} onReset={handleReset} /> : null}
      </div>
    </div>
  );
}

function SearchResult({
  d,
  result,
  compact,
  onReset,
}: {
  d: Dictionary['semak'];
  result: QueryClassification;
  compact: boolean;
  onReset: () => void;
}) {
  const panduan = d.panduan[result.kind];

  return (
    <div className="stack-lg">
      <section className="card stack">
        <div className="divider-title">
          <h2>{d.hasilTitle}</h2>
        </div>
        <p className="small muted" style={{ marginBottom: 0 }}>
          {d.dikenalPastiSebagai}
        </p>
        <p style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 0 }}>
          {d.kinds[result.kind]}
          {result.normalized ? <span className="muted"> — {result.normalized}</span> : null}
        </p>
        {result.alternatives.length > 0 ? (
          <p className="small muted" style={{ marginBottom: 0 }}>
            {d.bolehJadiJuga}: {result.alternatives.map((a) => d.kinds[a]).join(', ')}
          </p>
        ) : null}
      </section>

      {/* Semakan rasmi sentiasa dipaparkan, untuk semua jenis input. */}
      <section className="card stack">
        <h2>{d.rasmiTitle}</h2>
        <p className="muted">{d.rasmiLead}</p>
        <div className="btnrow">
          <a className="btn btn--primary ext" href={SEMAK_MULE_URL} target="_blank" rel="noopener noreferrer">
            {d.semakMuleCta}
          </a>
          <button type="button" className="btn btn--secondary" onClick={onReset}>
            {d.reset}
          </button>
        </div>
        <p className="small muted" style={{ marginBottom: 0 }}>
          {d.semakMuleNota}
        </p>
        {panduan.length > 0 ? (
          <ul className="flaglist" style={{ marginTop: '0.5rem' }}>
            {panduan.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : null}
      </section>

      {result.kind === 'url' ? (
        <section className="card stack">
          <h2>{d.hints.title}</h2>
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
        </section>
      ) : null}

      {!compact ? (
        <section className="card stack">
          <h2>{d.komunitiTitle}</h2>
          <div className="callout callout--nota">
            <p style={{ marginBottom: 0 }}>{d.komunitiBelumAda}</p>
          </div>
          <div className="btnrow">
            <Link className="btn btn--secondary" href="/status-laporan">
              {d.komunitiStatusCta}
            </Link>
            <Link className="btn btn--danger" href="/kalau-dah-kena">
              {d.laporCta}
            </Link>
          </div>
          <p className="small muted" style={{ marginBottom: 0 }}>
            {d.laporNota}
          </p>
        </section>
      ) : (
        <p>
          <Link className="btn btn--secondary" href="/semak">
            {d.title}
          </Link>
        </p>
      )}
    </div>
  );
}
