import type { Metadata } from 'next';
import Link from 'next/link';
import { Callout } from '@/components/ui';
import { tokenSah } from '@/lib/digest';
import { dict, getLang } from '@/lib/i18n';
import { getStore } from '@/lib/laporan/store';

export const metadata: Metadata = { robots: { index: false, follow: false } };

/** Berhenti melanggan membuang alamat sepenuhnya, bukan sekadar menandanya. */
export default async function BerhentiPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  const lang = await getLang();
  const d = dict(lang);

  let berjaya = false;
  if (token && tokenSah(token)) {
    const store = await getStore();
    berjaya = await store.berhentiLangganan(token);
  }

  return (
    <div className="container page stack-lg prose">
      <h1>{d.digest.berhentiTitle}</h1>
      <Callout tone={berjaya ? 'info' : 'amaran'}>
        <p style={{ marginBottom: 0 }}>{berjaya ? d.digest.berhentiJaya : d.digest.berhentiGagal}</p>
      </Callout>
      <p>
        <Link className="btn btn--secondary" href="/berita">
          {d.berita.kembali}
        </Link>
      </p>
    </div>
  );
}
