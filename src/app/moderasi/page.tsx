import type { Metadata } from 'next';
import Link from 'next/link';
import { BorangMasuk } from '@/components/BorangMasuk';
import { KadModerasi } from '@/components/KadModerasi';
import { Callout } from '@/components/ui';
import { logKeluar } from './actions';
import { dict, getLang } from '@/lib/i18n';
import { getStore } from '@/lib/laporan/store';
import { menggunakanAkaunLalai, moderasiDikonfigurasi, moderatorSemasa } from '@/lib/moderator';

export const metadata: Metadata = {
  title: 'Moderasi',
  robots: { index: false, follow: false },
};

export default async function ModerasiPage() {
  const lang = await getLang();
  const d = dict(lang);
  const moderator = await moderatorSemasa();

  if (!moderator) {
    return (
      <div className="container page stack-lg" style={{ maxWidth: '30rem' }}>
        <header className="hero">
          <h1>{d.moderasi.masukTitle}</h1>
        </header>
        {!moderasiDikonfigurasi() ? (
          <Callout tone="bahaya">
            <p style={{ marginBottom: 0 }}>{d.moderasi.masukTiada}</p>
          </Callout>
        ) : (
          <>
            {menggunakanAkaunLalai() ? (
              <Callout tone="amaran">
                <p style={{ marginBottom: 0 }}>{d.moderasi.masukLalai}</p>
              </Callout>
            ) : null}
            <section className="panel">
              <BorangMasuk d={d.moderasi} />
            </section>
          </>
        )}
      </div>
    );
  }

  const store = await getStore();
  const [giliran, tersiar, log] = await Promise.all([
    store.senarai({ giliran: true, had: 50 }),
    store.senarai({ status: ['dilaporkan_komuniti', 'dipertikai'], had: 50 }),
    store.logModerator(50),
  ]);
  const tersiarAktif = tersiar.filter((l) => l.dibuang_pada === null && l.ditolak_pada === null);

  return (
    <div className="container page stack-xl">
      <header className="hero">
        <h1>{d.moderasi.title}</h1>
        <p className="hero__lead">{d.moderasi.lead}</p>
        <div className="btnrow" style={{ alignItems: 'center' }}>
          <span className="chip">
            {d.moderasi.sebagai}: {moderator.id}
          </span>
          <form action={logKeluar}>
            <button type="submit" className="btn btn--secondary">
              {d.moderasi.keluar}
            </button>
          </form>
        </div>
      </header>

      <Callout tone="nota">
        <p style={{ marginBottom: 0 }}>{d.moderasi.tindakanNota}</p>
      </Callout>

      <section className="stack" aria-labelledby="giliran">
        <div className="divider-title">
          <h2 id="giliran">
            {d.moderasi.giliranTitle} <span className="kiraan">{giliran.length}</span>
          </h2>
        </div>
        {giliran.length === 0 ? (
          <p className="muted">{d.moderasi.giliranKosong}</p>
        ) : (
          <div className="stack">
            {giliran.map((laporan) => (
              <KadModerasi
                key={laporan.id}
                laporan={laporan}
                d={d.moderasi}
                dLapor={d.lapor}
                lang={lang}
                tindakan={['terima', 'tolak']}
              />
            ))}
          </div>
        )}
      </section>

      <section className="stack" aria-labelledby="tersiar">
        <div className="divider-title">
          <h2 id="tersiar">
            {d.moderasi.tersiarTitle} <span className="kiraan">{tersiarAktif.length}</span>
          </h2>
        </div>
        {tersiarAktif.length === 0 ? (
          <p className="muted">{d.moderasi.tersiarKosong}</p>
        ) : (
          <div className="stack">
            {tersiarAktif.map((laporan) => (
              <div key={laporan.id} className="stack">
                <KadModerasi
                  laporan={laporan}
                  d={d.moderasi}
                  dLapor={d.lapor}
                  lang={lang}
                  tindakan={['tanda_dipertikai', 'buang']}
                />
                <p className="small">
                  <Link href={`/laporan/${laporan.id}`}>/laporan/{laporan.id.slice(0, 8)}…</Link>
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="stack" aria-labelledby="log">
        <div className="divider-title">
          <h2 id="log">{d.moderasi.logTitle}</h2>
        </div>
        {log.length === 0 ? (
          <p className="muted">{d.moderasi.logKosong}</p>
        ) : (
          <div className="tablewrap panel" style={{ padding: 0 }}>
            <table>
              <thead>
                <tr>
                  <th scope="col">{d.moderasi.logLajur.tarikh}</th>
                  <th scope="col">{d.moderasi.logLajur.moderator}</th>
                  <th scope="col">{d.moderasi.logLajur.tindakan}</th>
                  <th scope="col">{d.moderasi.logLajur.laporan}</th>
                  <th scope="col">{d.moderasi.logLajur.sebab}</th>
                </tr>
              </thead>
              <tbody>
                {log.map((baris) => (
                  <tr key={baris.id}>
                    <td>{baris.tarikh.slice(0, 16).replace('T', ' ')}</td>
                    <td>{baris.moderator_id}</td>
                    <td>{d.moderasi.tindakan[baris.tindakan]}</td>
                    <td>{baris.laporan_id?.slice(0, 8) ?? '—'}</td>
                    <td>{baris.sebab ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
