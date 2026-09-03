import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BorangBantahan } from '@/components/BorangBantahan';
import { Callout, ExternalLink } from '@/components/ui';
import { sokongLaporan } from '@/app/laporan/actions';
import { getCategory } from '@/lib/content';
import { dict, getLang } from '@/lib/i18n';
import { getStore } from '@/lib/laporan/store';
import { bolehTersiar } from '@/lib/laporan/types';
import { SEMAK_MULE_URL } from '@/lib/official';
import { labelDenganKiraan, statusKeterangan, STATUS_META } from '@/lib/status';

export async function generateMetadata(): Promise<Metadata> {
  const d = dict(await getLang());
  // Laporan individu tidak diindeks: ia bukan rekod rasmi.
  return { title: d.laporanAwam.title, robots: { index: false, follow: false } };
}

export default async function LaporanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lang = await getLang();
  const d = dict(lang);

  const store = await getStore();
  const laporan = await store.dapatkan(id);
  if (!laporan || !bolehTersiar(laporan)) notFound();

  const bantahan = await store.bantahanUntuk(laporan.id);
  const kategori = laporan.kategori_slug ? getCategory(laporan.kategori_slug, lang) : undefined;
  const meta = STATUS_META[laporan.status];
  const kelasBadge =
    meta.tone === 'amaran' ? 'badge badge--tinggi' : meta.tone === 'pertikai' ? 'badge badge--sederhana' : 'badge badge--neutral';

  return (
    <div className="container page stack-lg">
      <header className="stack">
        <p className="small">
          <Link href="/semak">← {d.semak.title}</Link>
        </p>
        <div className="chips">
          <span className={kelasBadge}>
            {labelDenganKiraan(laporan.status, laporan.bilangan_sokongan, lang)}
          </span>
        </div>
        <h1 style={{ overflowWrap: 'anywhere' }}>{laporan.nilai_kenalan}</h1>
        <p className="muted small" style={{ marginBottom: 0 }}>
          {d.laporanAwam.jenisLabel}: {d.lapor.jenis[laporan.jenis_kenalan]} · {d.laporanAwam.dilaporkanPada}{' '}
          {laporan.tarikh_hantar.slice(0, 10)}
        </p>
      </header>

      <Callout tone="amaran">
        <p style={{ marginBottom: '0.5rem' }}>{statusKeterangan(laporan.status, lang)}</p>
        <p style={{ marginBottom: 0 }}>{d.laporanAwam.penafian}</p>
      </Callout>

      <section className="panel kilau stack">
        <h2>{d.laporanAwam.peneranganLabel}</h2>
        <p style={{ whiteSpace: 'pre-wrap', marginBottom: 0 }}>{laporan.penerangan}</p>
        {kategori ? (
          <p className="small muted" style={{ marginBottom: 0 }}>
            {d.laporanAwam.kategoriLabel}: <Link href={`/taktik/${kategori.slug}`}>{kategori.nama}</Link>
          </p>
        ) : null}
      </section>

      {bantahan.length > 0 ? (
        <section className="panel kilau stack">
          <h2>{d.laporanAwam.bantahSedia}</h2>
          {bantahan.map((b) => (
            <blockquote key={b.id} className="petikan">
              <p style={{ whiteSpace: 'pre-wrap' }}>{b.hujah}</p>
              <footer className="small muted">
                {b.pembantah_nama} · {b.diterima_pada.slice(0, 10)}
              </footer>
            </blockquote>
          ))}
        </section>
      ) : null}

      <section className="panel kilau stack">
        <h2>{d.semak.rasmiTitle}</h2>
        <p className="muted">{d.semak.rasmiLead}</p>
        <div className="btnrow">
          <ExternalLink href={SEMAK_MULE_URL} className="btn btn--primary">
            {d.semak.semakMuleCta}
          </ExternalLink>
          <Link className="btn btn--danger" href="/kalau-dah-kena">
            {d.nav.bantuan}
          </Link>
        </div>
      </section>

      <section className="panel kilau stack">
        <h2>{d.laporanAwam.sokongTitle}</h2>
        <p className="muted">{d.laporanAwam.sokongLead}</p>
        <form action={sokongLaporan}>
          <input type="hidden" name="laporan_id" value={laporan.id} />
          <button type="submit" className="btn btn--secondary">
            {d.laporanAwam.sokongCta}
          </button>
        </form>
      </section>

      <section className="panel kilau stack">
        <h2>{d.laporanAwam.bantahTitle}</h2>
        <p className="muted">{d.laporanAwam.bantahLead}</p>
        <BorangBantahan laporanId={laporan.id} d={d.laporanAwam} ralatTeks={d.lapor.ralat} />
        <p className="small muted" style={{ marginBottom: 0 }}>
          <Link href="/hak-menjawab">{d.footer.hakMenjawab}</Link>
        </p>
      </section>
    </div>
  );
}
