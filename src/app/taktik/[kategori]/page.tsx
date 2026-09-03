import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Callout, PlatformChips, RiskBadge } from '@/components/ui';
import { getCategory, listCategorySlugs } from '@/lib/content';
import { getArticleSummaries } from '@/lib/berita';
import { artikelUntukKategori } from '@/lib/artikel';
import { dict, getLang } from '@/lib/i18n';

type Params = { params: Promise<{ kategori: string }> };

export function generateStaticParams() {
  return listCategorySlugs().map((kategori) => ({ kategori }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { kategori } = await params;
  const lang = await getLang();
  const entry = getCategory(kategori, lang);
  if (!entry) return {};
  return { title: entry.nama, description: entry.ringkasan };
}

export default async function KategoriPage({ params }: Params) {
  const { kategori } = await params;
  const lang = await getLang();
  const d = dict(lang);
  const entry = getCategory(kategori, lang);

  if (!entry) notFound();

  // Pautan silang menggunakan taksonomi yang sama seperti modul berita.
  const berita = artikelUntukKategori(getArticleSummaries(lang), entry.slug);

  return (
    <article className="container page stack-xl">
      <header className="stack">
        <p className="small">
          <Link href="/taktik">← {d.taktik.kembali}</Link>
        </p>
        <div className="chips">
          <RiskBadge risiko={entry.risiko} lang={lang} />
        </div>
        <h1>{entry.nama}</h1>
        <p className="hero__lead">{entry.ringkasan}</p>
        <PlatformChips platform={entry.platform} lang={lang} />
        {entry.juga_dikenali.length > 0 ? (
          <p className="small muted" style={{ marginBottom: 0 }}>
            {d.common.jugaDikenali}: {entry.juga_dikenali.join(' · ')}
          </p>
        ) : null}
        <p className="small muted" style={{ marginBottom: 0 }}>
          {d.common.kemasKini}: {entry.kemas_kini}
        </p>
        {entry.langSumber !== lang ? (
          <Callout tone="nota">
            <p style={{ marginBottom: 0 }}>{d.common.terjemahanBelumSedia}</p>
          </Callout>
        ) : null}
      </header>

      {entry.red_flags.length > 0 ? (
        <section className="panel kilau stack" aria-labelledby="red-flags">
          <h2 id="red-flags">{d.common.redFlags}</h2>
          <ul className="flaglist">
            {entry.red_flags.map((flag) => (
              <li key={flag}>{flag}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="prose md" dangerouslySetInnerHTML={{ __html: entry.html }} />

      {entry.contoh_taktik.length > 0 ? (
        <section className="stack" aria-labelledby="contoh">
          <h2 id="contoh">{d.common.contohMesej}</h2>
          <p className="seksyen__lead small">{d.common.contohAnonim}</p>
          <div className="stack">
            {entry.contoh_taktik.map((contoh) => (
              <div key={contoh.tajuk} className="script">
                <p className="script__head">{contoh.tajuk}</p>
                <div className="script__body">
                  <p className="script__bubble">{contoh.mesej}</p>
                  <p className="script__why">
                    <strong>{d.common.kenapaBahaya}:</strong> {contoh.kenapa_bahaya}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {berita.length > 0 ? (
        <section className="stack" aria-labelledby="berita-berkaitan">
          <h2 id="berita-berkaitan">{d.berita.beritaUntukKategori}</h2>
          <ul className="senarai-ringkas">
            {berita.map((a) => (
              <li key={a.slug}>
                <Link href={`/berita/${a.slug}`}>{a.tajuk}</Link>{' '}
                <span className="muted small">
                  · {d.berita.jenisLabel[a.jenis]} · {a.sumber_nama}
                </span>
              </li>
            ))}
          </ul>
          <p className="small">
            <Link href="/berita">{d.berita.lihatSemua}</Link>
          </p>
        </section>
      ) : null}

      <section className="panel kilau stack" aria-labelledby="dah-kena">
        <h2 id="dah-kena" style={{ fontSize: '1.2rem' }}>
          {d.taktik.langkahPantasTitle}
        </h2>
        {entry.langkah_pantas.length > 0 ? (
          <ol>
            {entry.langkah_pantas.map((langkah) => (
              <li key={langkah}>{langkah}</li>
            ))}
          </ol>
        ) : null}
        <div className="btnrow">
          <Link className="btn btn--danger" href="/kalau-dah-kena">
            {d.taktik.langkahPantasCta}
          </Link>
          <a className="btn btn--secondary" href="tel:997">
            997
          </a>
          <Link className="btn btn--secondary" href="/semak">
            {d.semak.title}
          </Link>
        </div>
      </section>
    </article>
  );
}
