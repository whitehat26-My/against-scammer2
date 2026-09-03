import type { Metadata } from 'next';
import Link from 'next/link';
import { BorangLaporan } from '@/components/BorangLaporan';
import { Callout } from '@/components/ui';
import { getCategorySummaries } from '@/lib/content';
import { isJenisKenalan } from '@/lib/laporan/types';
import { captchaDikonfigurasi, captchaWajib, kunciTapakCaptcha, penyediaCaptcha } from '@/lib/captcha';
import { dict, getLang } from '@/lib/i18n';

export async function generateMetadata(): Promise<Metadata> {
  const d = dict(await getLang());
  return { title: d.lapor.title, description: d.lapor.lead, robots: { index: true, follow: true } };
}

export default async function LaporPage({
  searchParams,
}: {
  searchParams: Promise<{ jenis?: string }>;
}) {
  const lang = await getLang();
  const d = dict(lang);
  const { jenis } = await searchParams;
  const kategori = getCategorySummaries(lang).map((k) => ({ slug: k.slug, nama: k.nama }));

  const penyedia = penyediaCaptcha();
  const kunciTapak = kunciTapakCaptcha();
  const captcha = penyedia && kunciTapak ? { penyedia, kunciTapak } : undefined;
  // Gagal-tutup: dalam produksi tanpa CAPTCHA, borang tidak dipaparkan langsung.
  const borangDitutup = captchaWajib() && !captchaDikonfigurasi();

  return (
    <div className="container page stack-lg">
      <header className="hero">
        <h1>{d.lapor.title}</h1>
        <p className="hero__lead">{d.lapor.lead}</p>
      </header>

      <Callout tone="amaran" title={d.lapor.amaranTitle}>
        <ul style={{ marginBottom: 0 }}>
          {d.lapor.amaran.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Callout>

      <section className="panel kilau">
        {borangDitutup ? (
          <div className="notis notis--bahaya">
            <p style={{ marginBottom: 0 }}>{d.lapor.ralat.captcha_belum_sedia}</p>
          </div>
        ) : (
          <BorangLaporan
            d={d.lapor}
            kategori={kategori}
            jenisAwal={isJenisKenalan(jenis) ? jenis : undefined}
            captcha={captcha}
          />
        )}
      </section>

      <p className="small muted">
        <Link href="/status-laporan">{d.footer.status}</Link> · <Link href="/privasi">{d.footer.privasi}</Link> ·{' '}
        <Link href="/hak-menjawab">{d.footer.hakMenjawab}</Link>
      </p>
    </div>
  );
}
