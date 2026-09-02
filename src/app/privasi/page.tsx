import type { Metadata } from 'next';
import Link from 'next/link';
import { Callout } from '@/components/ui';
import { KONTAK_EMEL, PRIVASI_KEMAS_KINI } from '@/lib/config';
import { dict, getLang } from '@/lib/i18n';

export async function generateMetadata(): Promise<Metadata> {
  const d = dict(await getLang());
  return { title: d.privasi.title, description: d.privasi.lead };
}

export default async function PrivasiPage() {
  const lang = await getLang();
  const d = dict(lang);

  return (
    <div className="container page stack-xl">
      <header className="hero">
        <h1>{d.privasi.title}</h1>
        <p className="hero__lead">{d.privasi.lead}</p>
        <p className="small muted">
          {d.common.kemasKini}: {PRIVASI_KEMAS_KINI}
        </p>
      </header>

      <section className="panel stack" aria-labelledby="carian">
        <h2 id="carian">{d.privasi.carianTitle}</h2>
        <p>{d.privasi.carianLead}</p>
        <ul>
          {d.privasi.carianButiran.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="stack" aria-labelledby="kumpul">
        <div className="divider-title">
          <h2 id="kumpul">{d.privasi.kumpulTitle}</h2>
        </div>
        <div className="tablewrap card" style={{ padding: 0 }}>
          <table>
            <thead>
              <tr>
                <th scope="col">{lang === 'ms' ? 'Data' : 'Data'}</th>
                <th scope="col">{lang === 'ms' ? 'Tujuan' : 'Purpose'}</th>
                <th scope="col">{lang === 'ms' ? 'Simpanan' : 'Retention'}</th>
              </tr>
            </thead>
            <tbody>
              {d.privasi.kumpul.map((row) => (
                <tr key={row.apa}>
                  <th scope="row">{row.apa}</th>
                  <td>{row.kenapa}</td>
                  <td>{row.simpan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="stack" aria-labelledby="fasa">
        <div className="divider-title">
          <h2 id="fasa">{d.privasi.fasaTitle}</h2>
        </div>
        <p className="prose">{d.privasi.fasaLead}</p>
        <Callout tone="info">
          <ul style={{ marginBottom: 0 }}>
            {d.privasi.fasa.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Callout>
      </section>

      <section className="panel stack" aria-labelledby="hak">
        <h2 id="hak">{d.privasi.hakTitle}</h2>
        <p>{d.privasi.hakLead}</p>
        <div className="btnrow">
          <a className="btn btn--primary" href={`mailto:${KONTAK_EMEL}`}>
            {KONTAK_EMEL}
          </a>
          <Link className="btn btn--secondary" href="/hak-menjawab">
            {d.privasi.hakCta}
          </Link>
        </div>
      </section>

      <section className="stack prose" aria-labelledby="perubahan">
        <div className="divider-title">
          <h2 id="perubahan">{d.privasi.kemasKiniTitle}</h2>
        </div>
        <p>{d.privasi.kemasKiniLead}</p>
      </section>
    </div>
  );
}
