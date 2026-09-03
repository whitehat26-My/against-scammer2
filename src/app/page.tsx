import Link from 'next/link';
import { SearchTool } from '@/components/SearchTool';
import { getCategorySummaries } from '@/lib/content';
import { dict, getLang } from '@/lib/i18n';
import { PLATFORM_LABEL, RISK_LABEL } from '@/lib/taxonomy';

/** Berapa banyak kategori dipaparkan di halaman utama sebelum "lihat semua". */
const KATEGORI_DI_HALAMAN_UTAMA = 6;

export default async function HomePage() {
  const lang = await getLang();
  const d = dict(lang);
  const semua = getCategorySummaries(lang);
  const categories = semua.slice(0, KATEGORI_DI_HALAMAN_UTAMA);

  return (
    <div className="container page stack-xl">
      {/*
        Hero dan alat semakan digabungkan menjadi satu blok pembuka: tindakan
        utama halaman ini adalah menyemak sesuatu, jadi ia tidak patut berada
        di bawah satu tajuk seksyen yang berasingan.
      */}
      <section className="hero hero--dua">
        <div className="hero__teks">
          <p className="hero__eyebrow">{d.home.eyebrow}</p>
          <h1>{d.home.title}</h1>
          <p className="hero__lead">{d.home.lead}</p>
        </div>

        <div className="panel kilau stack hero__aksi">
          <div>
            <h2 style={{ fontSize: '1.15rem', marginBottom: '0.3rem' }}>{d.home.searchTitle}</h2>
            <p className="small muted" style={{ marginBottom: 0 }}>
              {d.home.searchLead}
            </p>
          </div>
          <SearchTool d={d.semak} lang={lang} compact />
        </div>

        <div className="btnrow hero__cta">
          <Link className="btn btn--secondary" href="/taktik">
            {d.home.ctaTaktik}
          </Link>
          <Link className="btn btn--danger" href="/kalau-dah-kena">
            {d.home.ctaBantuan}
          </Link>
        </div>
      </section>

      <section aria-labelledby="taktik-utama">
        <p className="seksyen__eyebrow">{d.home.taktikEyebrow}</p>
        <h2 id="taktik-utama">{d.home.taktikTitle}</h2>
        <p className="seksyen__lead">{d.home.taktikLead}</p>

        <div className="grid grid--2 grid--3" style={{ marginTop: '1.5rem' }}>
          {categories.map((c) => (
            <Link key={c.slug} href={`/taktik/${c.slug}`} className="panel kilau card--link">
              <div className="chips" style={{ marginBottom: '0.7rem' }}>
                <span className={`badge badge--${c.risiko}`}>{RISK_LABEL[c.risiko][lang]}</span>
              </div>
              <h3 className="card__title">{c.nama}</h3>
              <p className="small muted" style={{ marginBottom: '0.7rem' }}>
                {c.ringkasan}
              </p>
              <ul className="chips">
                {c.platform.slice(0, 2).map((p) => (
                  <li key={p} className="chip">
                    {PLATFORM_LABEL[p][lang]}
                  </li>
                ))}
              </ul>
            </Link>
          ))}
        </div>

        <p style={{ marginTop: '1.25rem', marginBottom: 0 }}>
          <Link className="btn btn--sunyi" href="/taktik">
            {d.home.taktikSemua} →
          </Link>
        </p>
      </section>

      <section aria-labelledby="cara-guna">
        <p className="seksyen__eyebrow">{d.home.caraEyebrow}</p>
        <h2 id="cara-guna">{d.home.caraTitle}</h2>
        <ol className="langkah-ringkas" style={{ marginTop: '1.5rem' }}>
          {d.home.caraSteps.map((step) => (
            <li key={step.tajuk}>
              <h3>{step.tajuk}</h3>
              <p>{step.teks}</p>
            </li>
          ))}
        </ol>
      </section>

      {/*
        Had portal dipaparkan sebagai jalur ringkas, bukan kotak amaran besar:
        ia maklumat asas tentang skop, bukan amaran kecemasan.
      */}
      <section aria-labelledby="had-portal" className="jalur">
        <p className="seksyen__eyebrow">{d.home.hadEyebrow}</p>
        <h2 id="had-portal">{d.home.hadTitle}</h2>
        <ul className="jalur__senarai">
          {d.home.hadItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p style={{ marginBottom: 0 }}>
          <Link className="btn btn--sunyi" href="/tentang">
            {d.home.hadCta} →
          </Link>
        </p>
      </section>
    </div>
  );
}
