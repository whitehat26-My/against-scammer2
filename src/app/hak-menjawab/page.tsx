import type { Metadata } from 'next';
import Link from 'next/link';
import { Callout } from '@/components/ui';
import { KONTAK_EMEL } from '@/lib/config';
import { dict, getLang } from '@/lib/i18n';

export async function generateMetadata(): Promise<Metadata> {
  const d = dict(await getLang());
  return { title: d.hakMenjawab.title, description: d.hakMenjawab.lead };
}

export default async function HakMenjawabPage() {
  const lang = await getLang();
  const d = dict(lang);

  return (
    <div className="container page stack-xl">
      <header className="hero">
        <h1>{d.hakMenjawab.title}</h1>
        <p className="hero__lead">{d.hakMenjawab.lead}</p>
      </header>

      <section className="stack" aria-labelledby="siapa">
        <div className="divider-title">
          <h2 id="siapa">{d.hakMenjawab.siapaTitle}</h2>
        </div>
        <ul className="prose">
          {d.hakMenjawab.siapa.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="stack" aria-labelledby="cara">
        <div className="divider-title">
          <h2 id="cara">{d.hakMenjawab.caraTitle}</h2>
        </div>
        <ol className="prose">
          {d.hakMenjawab.cara.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </section>

      <section className="stack" aria-labelledby="proses">
        <div className="divider-title">
          <h2 id="proses">{d.hakMenjawab.prosesTitle}</h2>
        </div>
        <Callout tone="info">
          <ol style={{ marginBottom: 0 }}>
            {d.hakMenjawab.proses.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </Callout>
      </section>

      <section className="stack prose" aria-labelledby="pdpa">
        <div className="divider-title">
          <h2 id="pdpa">{d.hakMenjawab.pdpaTitle}</h2>
        </div>
        <p>{d.hakMenjawab.pdpaLead}</p>
      </section>

      <section className="card stack" aria-labelledby="kontak">
        <h2 id="kontak">{d.hakMenjawab.kontakTitle}</h2>
        <div className="btnrow">
          <a className="btn btn--primary" href={`mailto:${KONTAK_EMEL}`}>
            {KONTAK_EMEL}
          </a>
          <Link className="btn btn--secondary" href="/status-laporan">
            {d.footer.status}
          </Link>
        </div>
        <p className="small muted" style={{ marginBottom: 0 }}>
          {d.hakMenjawab.kontakNota}
        </p>
      </section>
    </div>
  );
}
