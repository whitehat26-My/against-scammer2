import type { Metadata } from 'next';
import { BeritaBrowser } from '@/components/BeritaBrowser';
import { BorangDigest } from '@/components/BorangDigest';
import { getArticleSummaries } from '@/lib/berita';
import { getCategorySummaries } from '@/lib/content';
import { digestAktif } from '@/lib/emel';
import { dict, getLang } from '@/lib/i18n';

export async function generateMetadata(): Promise<Metadata> {
  const d = dict(await getLang());
  return { title: d.berita.title, description: d.berita.lead };
}

export default async function BeritaPage() {
  const lang = await getLang();
  const d = dict(lang);
  const artikel = getArticleSummaries(lang);
  const kategori = getCategorySummaries(lang).map((k) => ({ slug: k.slug, nama: k.nama }));

  return (
    <div className="container page stack-xl">
      <header className="hero">
        <h1>{d.berita.title}</h1>
        <p className="hero__lead">{d.berita.lead}</p>
      </header>

      <BeritaBrowser items={artikel} kategori={kategori} d={d.berita} common={d.common} lang={lang} />

      {/* Borang digest hanya dipaparkan apabila penghantar e-mel dikonfigurasi. */}
      {digestAktif() ? (
        <section className="panel stack" aria-labelledby="digest">
          <h2 id="digest">{d.digest.title}</h2>
          <p className="muted">{d.digest.lead}</p>
          <BorangDigest d={d.digest} />
        </section>
      ) : null}
    </div>
  );
}
