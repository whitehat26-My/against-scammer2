import type { Metadata } from 'next';
import Link from 'next/link';
import { Callout } from '@/components/ui';
import { KONTAK_EMEL } from '@/lib/config';
import { dict, getLang } from '@/lib/i18n';

export async function generateMetadata(): Promise<Metadata> {
  const d = dict(await getLang());
  return { title: d.tentang.title, description: d.tentang.lead };
}

export default async function TentangPage() {
  const lang = await getLang();
  const d = dict(lang);

  return (
    <div className="container page stack-xl">
      <header className="hero">
        <h1>{d.tentang.title}</h1>
        <p className="hero__lead">{d.tentang.lead}</p>
      </header>

      <section className="stack prose" aria-labelledby="tujuan">
        <div className="divider-title">
          <h2 id="tujuan">{d.tentang.tujuanTitle}</h2>
        </div>
        <p>{d.tentang.tujuanLead}</p>
      </section>

      <section className="stack" aria-labelledby="beza">
        <div className="divider-title">
          <h2 id="beza">{d.tentang.bezaTitle}</h2>
        </div>
        <div className="grid grid--2">
          <div className="panel">
            <h3 className="card__title">{d.tentang.bezaRasmiTitle}</h3>
            <ul style={{ marginBottom: 0 }}>
              {d.tentang.bezaRasmi.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="panel">
            <h3 className="card__title">{d.tentang.bezaKamiTitle}</h3>
            <ul style={{ marginBottom: 0 }}>
              {d.tentang.bezaKami.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="stack" aria-labelledby="fasa">
        <div className="divider-title">
          <h2 id="fasa">{d.tentang.fasaTitle}</h2>
        </div>
        <div className="grid grid--2">
          <div className="panel">
            <h3 className="card__title">{d.tentang.fasaSekarang}</h3>
            <ul style={{ marginBottom: 0 }}>
              {d.tentang.fasaSekarangItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="panel">
            <h3 className="card__title">{d.tentang.fasaSeterusnya}</h3>
            <ul style={{ marginBottom: 0 }}>
              {d.tentang.fasaSeterusnyaItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="stack prose" aria-labelledby="kandungan">
        <div className="divider-title">
          <h2 id="kandungan">{d.tentang.kandunganTitle}</h2>
        </div>
        <p>{d.tentang.kandunganLead}</p>
      </section>

      <section className="stack" aria-labelledby="had">
        <div className="divider-title">
          <h2 id="had">{d.tentang.hadTitle}</h2>
        </div>
        <Callout tone="amaran">
          <ul style={{ marginBottom: 0 }}>
            {d.tentang.hadItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Callout>
      </section>

      <section className="panel stack" aria-labelledby="sumbangan">
        <h2 id="sumbangan">{d.tentang.sumbanganTitle}</h2>
        <p>{d.tentang.sumbanganLead}</p>
        <div className="btnrow">
          <a className="btn btn--primary" href={`mailto:${KONTAK_EMEL}`}>
            {KONTAK_EMEL}
          </a>
          <Link className="btn btn--secondary" href="/privasi">
            {d.footer.privasi}
          </Link>
        </div>
      </section>
    </div>
  );
}
