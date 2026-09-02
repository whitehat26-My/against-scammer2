import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Callout, ExternalLink } from '@/components/ui';
import { getArticle, listArticleSlugs } from '@/lib/berita';
import { getCategory } from '@/lib/content';
import { dict, getLang } from '@/lib/i18n';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return listArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const artikel = getArticle(slug, await getLang());
  if (!artikel) return {};
  return { title: artikel.tajuk, description: artikel.ringkasan };
}

export default async function ArtikelPage({ params }: Params) {
  const { slug } = await params;
  const lang = await getLang();
  const d = dict(lang);
  const artikel = getArticle(slug, lang);
  if (!artikel) notFound();

  const kategori = artikel.kategori_tags
    .map((t) => getCategory(t, lang))
    .filter((k): k is NonNullable<typeof k> => Boolean(k));

  return (
    <article className="container page stack-lg">
      <header className="stack">
        <p className="small">
          <Link href="/berita">← {d.berita.kembali}</Link>
        </p>
        <div className="chips">
          <span className={artikel.jenis === 'berita' ? 'badge badge--sederhana' : 'badge badge--tinggi'}>
            {d.berita.jenisLabel[artikel.jenis]}
          </span>
          <span className="chip">{artikel.tarikh_terbit}</span>
        </div>
        <h1>{artikel.tajuk}</h1>
        <p className="hero__lead">{artikel.ringkasan}</p>
        {artikel.langSumber !== lang ? (
          <Callout tone="nota">
            <p style={{ marginBottom: 0 }}>{d.common.terjemahanBelumSedia}</p>
          </Callout>
        ) : null}
      </header>

      <Callout tone="nota">
        <p style={{ marginBottom: 0 }}>{d.berita.jenisNota[artikel.jenis]}</p>
      </Callout>

      {artikel.html.trim() ? <section className="prose md" dangerouslySetInnerHTML={{ __html: artikel.html }} /> : null}

      <section className="panel stack" aria-labelledby="sumber">
        <h2 id="sumber">{d.berita.sumberLabel}</h2>
        <p className="muted" style={{ marginBottom: 0 }}>
          {d.berita.sumberNota}
        </p>
        <div className="btnrow">
          <ExternalLink href={artikel.sumber_url} className="btn btn--primary">
            {d.berita.bacaSumber}
          </ExternalLink>
        </div>
        <p className="small muted" style={{ marginBottom: 0 }}>
          {artikel.sumber_nama} · {new URL(artikel.sumber_url).hostname}
        </p>
      </section>

      {kategori.length > 0 ? (
        <section className="stack" aria-labelledby="berkaitan">
          <div className="divider-title">
            <h2 id="berkaitan">{d.berita.kategoriBerkaitan}</h2>
          </div>
          <div className="grid grid--2">
            {kategori.map((k) => (
              <Link key={k.slug} href={`/taktik/${k.slug}`} className="panel card--link">
                <h3 className="card__title">{k.nama}</h3>
                <p className="small muted" style={{ marginBottom: 0 }}>
                  {k.ringkasan}
                </p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
