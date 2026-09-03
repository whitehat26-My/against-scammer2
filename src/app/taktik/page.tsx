import type { Metadata } from 'next';
import { TaktikBrowser } from '@/components/TaktikBrowser';
import { getCategorySummaries } from '@/lib/content';
import { dict, getLang } from '@/lib/i18n';

export async function generateMetadata(): Promise<Metadata> {
  const d = dict(await getLang());
  return { title: d.taktik.title, description: d.taktik.lead };
}

export default async function TaktikPage() {
  const lang = await getLang();
  const d = dict(lang);
  const items = getCategorySummaries(lang);

  return (
    <div className="container page stack-lg">
      <header className="hero">
        <h1>{d.taktik.title}</h1>
        <p className="hero__lead">{d.taktik.lead}</p>
      </header>
      <TaktikBrowser items={items} lang={lang} d={d.taktik} common={d.common} />
    </div>
  );
}
