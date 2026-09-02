'use client';

import Link from 'next/link';
import { useId, useMemo, useState } from 'react';
import { tapisArtikel, type ArtikelRingkas } from '@/lib/artikel';
import type { Dictionary, Lang } from '@/lib/i18n';

type Kategori = { slug: string; nama: string };

export function BeritaBrowser({
  items,
  kategori,
  d,
  common,
}: {
  items: ArtikelRingkas[];
  kategori: Kategori[];
  d: Dictionary['berita'];
  common: Dictionary['common'];
  lang: Lang;
}) {
  const [tag, setTag] = useState('');
  const [teks, setTeks] = useState('');
  const cariId = useId();
  const tagId = useId();

  const hasil = useMemo(() => tapisArtikel(items, tag, teks), [items, tag, teks]);
  const adaTapisan = Boolean(tag || teks);
  const namaKategori = useMemo(
    () => new Map(kategori.map((k) => [k.slug, k.nama])),
    [kategori],
  );

  function kosongkan() {
    setTag('');
    setTeks('');
  }

  return (
    <div className="stack-lg">
      <div className="stack">
        <div className="filters">
          <div className="field">
            <label className="field__label" htmlFor={cariId}>
              {common.cari}
            </label>
            <input
              id={cariId}
              className="input"
              type="search"
              autoComplete="off"
              placeholder={d.cariPlaceholder}
              value={teks}
              onChange={(e) => setTeks(e.target.value)}
            />
          </div>
          <div className="field">
            <label className="field__label" htmlFor={tagId}>
              {d.tapisTag}
            </label>
            <select id={tagId} className="input" value={tag} onChange={(e) => setTag(e.target.value)}>
              <option value="">{common.semua}</option>
              {kategori.map((k) => (
                <option key={k.slug} value={k.slug}>
                  {k.nama}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="btnrow" style={{ alignItems: 'center' }}>
          <p className="small muted" style={{ margin: 0 }} aria-live="polite">
            {d.hasil.replace('{n}', String(hasil.length))}
          </p>
          {adaTapisan ? (
            <button type="button" className="btn btn--secondary" onClick={kosongkan}>
              {common.kosongkan}
            </button>
          ) : null}
        </div>
      </div>

      {hasil.length === 0 ? (
        <div className="panel stack">
          <p style={{ marginBottom: 0 }}>{d.tiada}</p>
          <div className="btnrow">
            <button type="button" className="btn btn--secondary" onClick={kosongkan}>
              {d.kosongkan}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid--2">
          {hasil.map((a) => (
            <Link key={a.slug} href={`/berita/${a.slug}`} className="panel card--link">
              <div className="chips" style={{ marginBottom: '0.6rem' }}>
                <span className={a.jenis === 'berita' ? 'badge badge--sederhana' : 'badge badge--tinggi'}>
                  {d.jenisLabel[a.jenis]}
                </span>
                <span className="chip">{a.tarikh_terbit}</span>
              </div>
              <h2 className="card__title">{a.tajuk}</h2>
              <p className="small muted" style={{ marginBottom: '0.6rem' }}>
                {a.ringkasan}
              </p>
              <ul className="chips">
                {a.kategori_tags.slice(0, 3).map((t) => (
                  <li key={t} className="chip">
                    {namaKategori.get(t) ?? t}
                  </li>
                ))}
              </ul>
              <p className="card__meta">
                {d.sumberLabel}: {a.sumber_nama}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
