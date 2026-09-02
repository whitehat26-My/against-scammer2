import type { Metadata } from 'next';
import Link from 'next/link';
import { Callout } from '@/components/ui';
import { dict, getLang } from '@/lib/i18n';
import { REPORT_STATUSES, STATUS_META, statusKeterangan, statusLabel } from '@/lib/status';

export async function generateMetadata(): Promise<Metadata> {
  const d = dict(await getLang());
  return { title: d.laporan.title, description: d.laporan.lead };
}

export default async function StatusLaporanPage() {
  const lang = await getLang();
  const d = dict(lang);

  return (
    <div className="container page stack-xl">
      <header className="hero">
        <h1>{d.laporan.title}</h1>
        <p className="hero__lead">{d.laporan.lead}</p>
      </header>

      <section className="stack" aria-labelledby="kenapa">
        <div className="divider-title">
          <h2 id="kenapa">{d.laporan.kenapaTitle}</h2>
        </div>
        <p className="prose">{d.laporan.kenapaLead}</p>
      </section>

      <section className="stack" aria-labelledby="status">
        <div className="divider-title">
          <h2 id="status">{d.laporan.statusTitle}</h2>
        </div>
        <div className="grid grid--3">
          {REPORT_STATUSES.map((status) => (
            <div key={status} className="card">
              <p className="chips" style={{ marginBottom: '0.6rem' }}>
                <span
                  className={
                    STATUS_META[status].tone === 'amaran'
                      ? 'badge badge--tinggi'
                      : STATUS_META[status].tone === 'pertikai'
                        ? 'badge badge--sederhana'
                        : 'badge badge--neutral'
                  }
                >
                  {statusLabel(status, lang)}
                </span>
              </p>
              <p className="small muted" style={{ marginBottom: 0 }}>
                {statusKeterangan(status, lang)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="stack" aria-labelledby="peraturan">
        <div className="divider-title">
          <h2 id="peraturan">{d.laporan.peraturanTitle}</h2>
        </div>
        <Callout tone="info">
          <ul style={{ marginBottom: 0 }}>
            {d.laporan.peraturan.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Callout>
      </section>

      <p>
        <Link className="btn btn--secondary" href="/hak-menjawab">
          {d.laporan.hakCta}
        </Link>
      </p>
    </div>
  );
}
