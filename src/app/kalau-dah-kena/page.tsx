import type { Metadata } from 'next';
import Link from 'next/link';
import { OfficialChannelList } from '@/components/OfficialChannelList';
import { Callout } from '@/components/ui';
import { dict, getLang } from '@/lib/i18n';
import { NSRC_TALIAN } from '@/lib/official';

export async function generateMetadata(): Promise<Metadata> {
  const d = dict(await getLang());
  return { title: d.bantuan.title, description: d.bantuan.lead };
}

export default async function KalauDahKenaPage() {
  const lang = await getLang();
  const d = dict(lang);

  return (
    <div className="container page stack-xl">
      <header className="hero">
        <h1>{d.bantuan.title}</h1>
        <p className="hero__lead">{d.bantuan.lead}</p>
        <div className="btnrow" style={{ marginTop: '1rem' }}>
          <a className="btn btn--danger" href={`tel:${NSRC_TALIAN}`}>
            {`NSRC ${NSRC_TALIAN}`}
          </a>
          <a className="btn btn--secondary" href="tel:999">
            999
          </a>
        </div>
      </header>

      <Callout tone="bahaya" title={d.bantuan.masaTitle}>
        <p style={{ marginBottom: 0 }}>{d.bantuan.masaLead}</p>
      </Callout>

      <section className="stack" aria-labelledby="langkah">
        <div className="divider-title">
          <h2 id="langkah">{d.bantuan.langkahTitle}</h2>
        </div>
        <ol className="steps">
          {d.bantuan.langkah.map((step) => (
            <li key={step.tajuk}>
              <h3>{step.tajuk}</h3>
              <p>{step.teks}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="panel stack" aria-labelledby="siapkan">
        <h2 id="siapkan">{d.bantuan.siapkanTitle}</h2>
        <ul>
          {d.bantuan.siapkan.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="stack" aria-labelledby="saluran">
        <div className="divider-title">
          <h2 id="saluran">{d.bantuan.saluranTitle}</h2>
        </div>
        <p className="muted">{d.bantuan.saluranLead}</p>
        <OfficialChannelList lang={lang} />
      </section>

      <section className="stack" aria-labelledby="jangkaan">
        <div className="divider-title">
          <h2 id="jangkaan">{d.bantuan.jangkaanTitle}</h2>
        </div>
        <Callout tone="amaran">
          <ul style={{ marginBottom: 0 }}>
            {d.bantuan.jangkaan.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Callout>
      </section>

      <section className="panel stack" aria-labelledby="emosi">
        <h2 id="emosi">{d.bantuan.emosiTitle}</h2>
        <p className="muted">{d.bantuan.emosiLead}</p>
        <div className="btnrow">
          {d.bantuan.emosiTalian.map((talian) => (
            <a key={talian.nombor} className="btn btn--secondary" href={`tel:${talian.nombor.replace(/[^\d+]/g, '')}`}>
              {talian.nama} · {talian.nombor}
            </a>
          ))}
        </div>
      </section>

      <p>
        <Link href="/taktik">{d.home.ctaTaktik}</Link>
      </p>
    </div>
  );
}
