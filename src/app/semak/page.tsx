import type { Metadata } from 'next';
import Link from 'next/link';
import { SearchTool } from '@/components/SearchTool';
import { Callout } from '@/components/ui';
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

      <SearchTool d={d.semak} />

      <Callout tone="amaran" title={d.home.hadTitle}>
        <ul style={{ marginBottom: 0 }}>
          {d.home.hadItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Callout>

      <p className="small">
        <Link href="/privasi">{d.semak.privasiPautan}</Link>
      </p>
    </div>
  );
}
