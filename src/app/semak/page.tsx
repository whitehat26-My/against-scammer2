import type { Metadata } from 'next';
import Link from 'next/link';
import { SearchTool } from '@/components/SearchTool';
import { dict, getLang } from '@/lib/i18n';

export async function generateMetadata(): Promise<Metadata> {
  const d = dict(await getLang());
  return { title: d.semak.title, description: d.semak.lead };
}

export default async function SemakPage() {
  const lang = await getLang();
  const d = dict(lang);

  return (
    <div className="container page stack-lg">
      <header className="hero">
        <h1>{d.semak.title}</h1>
        <p className="hero__lead">{d.semak.lead}</p>
      </header>

      <SearchTool d={d.semak} lang={lang} />

      <section className="jalur" aria-labelledby="had-semak">
        <p className="seksyen__eyebrow">{d.home.hadEyebrow}</p>
        <h2 id="had-semak" style={{ fontSize: '1.1rem' }}>
          {d.home.hadTitle}
        </h2>
        <ul className="jalur__senarai">
          {d.home.hadItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="small" style={{ marginBottom: 0 }}>
          <Link href="/privasi">{d.semak.privasiPautan}</Link>
        </p>
      </section>
    </div>
  );
}
