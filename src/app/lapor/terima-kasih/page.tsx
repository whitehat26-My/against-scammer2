import type { Metadata } from 'next';
import Link from 'next/link';
import { Callout } from '@/components/ui';
import { dict, getLang } from '@/lib/i18n';

export async function generateMetadata(): Promise<Metadata> {
  const d = dict(await getLang());
  return { title: d.lapor.jayaTitle, robots: { index: false, follow: false } };
}

export default async function TerimaKasihPage() {
  const lang = await getLang();
  const d = dict(lang);

  return (
    <div className="container page stack-lg">
      <header className="hero">
        <h1>{d.lapor.jayaTitle}</h1>
        <p className="hero__lead">{d.lapor.jayaLead}</p>
      </header>

      <section className="panel stack">
        <ol className="steps">
          {d.lapor.jayaLangkah.map((langkah) => (
            <li key={langkah}>
              <p>{langkah}</p>
            </li>
          ))}
        </ol>
      </section>

      <Callout tone="bahaya">
        <p style={{ marginBottom: 0 }}>{d.lapor.jayaRasmi}</p>
      </Callout>

      <div className="btnrow">
        <Link className="btn btn--danger" href="/kalau-dah-kena">
          {d.nav.bantuan}
        </Link>
        <Link className="btn btn--secondary" href="/">
          {d.lapor.kembali}
        </Link>
      </div>
    </div>
  );
}
