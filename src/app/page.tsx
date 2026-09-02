import Link from 'next/link';
import { SearchTool } from '@/components/SearchTool';
import { Callout } from '@/components/ui';
import { getCategorySummaries } from '@/lib/content';
import { dict, getLang } from '@/lib/i18n';
import { PLATFORM_LABEL, RISK_LABEL } from '@/lib/taxonomy';

/** Berapa banyak kategori dipaparkan di halaman utama sebelum "lihat semua". */
const KATEGORI_DI_HALAMAN_UTAMA = 8;

export default async function HomePage() {
  const lang = await getLang();
  const d = dict(lang);
  const categories = getCategorySummaries(lang).slice(0, KATEGORI_DI_HALAMAN_UTAMA);

  return (
    <div className="container page stack-xl">
      <section className="hero">
        <p className="hero__eyebrow">{d.home.eyebrow}</p>
        <h1>{d.home.title}</h1>
        <p className="hero__lead">{d.home.lead}</p>
        <div className="btnrow" style={{ marginTop: '1.25rem' }}>
          <Link className="btn btn--primary" href="/taktik">
            {d.home.ctaTaktik}
          </Link>
          <Link className="btn btn--danger" href="/kalau-dah-kena">
            {d.home.ctaBantuan}
          </Link>
        </div>
      </section>

      <section className="panel stack" aria-labelledby="semak-cepat">
        <h2 id="semak-cepat">{d.home.searchTitle}</h2>
        <p className="muted">{d.home.searchLead}</p>
        <SearchTool d={d.semak} lang={lang} compact />
      </section>

      <section className="stack" aria-labelledby="taktik-utama">
        <div className="divider-title">
          <h2 id="taktik-utama">{d.home.taktikTitle}</h2>
        </div>
        <p className="muted">{d.home.taktikLead}</p>
        <div className="grid grid--2">
          {categories.map((c) => (
            <Link key={c.slug} href={`/taktik/${c.slug}`} className="panel card--link">
              <div className="chips" style={{ marginBottom: '0.6rem' }}>
                <span className={`badge badge--${c.risiko}`}>{RISK_LABEL[c.risiko][lang]}</span>
              </div>
              <h3 className="card__title">{c.nama}</h3>
              <p className="small muted" style={{ marginBottom: '0.6rem' }}>
                {c.ringkasan}
              </p>
              <ul className="chips">
                {c.platform.slice(0, 3).map((p) => (
                  <li key={p} className="chip">
                    {PLATFORM_LABEL[p][lang]}
                  </li>
                ))}
              </ul>
            </Link>
          ))}
        </div>
        <p>
          <Link className="btn btn--secondary" href="/taktik">
            {d.home.taktikSemua}
          </Link>
        </p>
      </section>

      <section className="stack" aria-labelledby="cara-guna">
        <div className="divider-title">
          <h2 id="cara-guna">{d.home.caraTitle}</h2>
        </div>
        <ol className="steps">
          {d.home.caraSteps.map((step) => (
            <li key={step.tajuk}>
              <h3>{step.tajuk}</h3>
              <p>{step.teks}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="stack" aria-labelledby="had-portal">
        <div className="divider-title">
          <h2 id="had-portal">{d.home.hadTitle}</h2>
        </div>
        <Callout tone="nota">
          <ul style={{ marginBottom: 0 }}>
            {d.home.hadItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Callout>
        <p>
          <Link href="/tentang">{d.home.hadCta}</Link>
        </p>
      </section>
    </div>
  );
}
