'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { akhiranHash, awalanHash, hashNilai } from '@/lib/laporan/nilai';
import type { PadananJulat } from '@/lib/laporan/types';
import type { JenisKenalan } from '@/lib/laporan/types';
import { labelDenganKiraan } from '@/lib/status';
import type { Dictionary, Lang } from '@/lib/i18n';

type Keadaan =
  | { fasa: 'memuat' }
  | { fasa: 'siap'; padanan: PadananJulat[] }
  | { fasa: 'ralat' };

/**
 * Semakan laporan komuniti secara k-anonymity.
 *
 * Pelayar mengira SHA-256 bagi maklumat yang dicari, kemudian menghantar
 * HANYA 5 aksara pertama hash itu kepada pelayan. Pelayan mengembalikan semua
 * laporan tersiar yang berkongsi awalan tersebut, dan padanan tepat dibuat
 * semula di dalam pelayar. Pelayan tidak pernah menerima maklumat yang dicari.
 */
export function LaporanKomuniti({
  jenis,
  nilai,
  d,
  lang,
}: {
  jenis: JenisKenalan[];
  nilai: string;
  d: Dictionary['semak'];
  lang: Lang;
}) {
  const [keadaan, setKeadaan] = useState<Keadaan>({ fasa: 'memuat' });

  useEffect(() => {
    let dibatalkan = false;

    async function semak() {
      try {
        if (typeof crypto === 'undefined' || !crypto.subtle) throw new Error('subtle-crypto-tiada');

        const kumpulan = await Promise.all(
          jenis.map(async (j) => {
            const hash = await hashNilai(j, nilai);
            const res = await fetch(`/api/laporan/julat?awalan=${awalanHash(hash)}`, {
              headers: { accept: 'application/json' },
            });
            if (!res.ok) throw new Error('status-bukan-ok');
            const data = (await res.json()) as { padanan: PadananJulat[] };
            const akhiran = akhiranHash(hash);
            return data.padanan.filter((p) => p.hash_suffix === akhiran);
          }),
        );

        if (dibatalkan) return;
        const unik = new Map<string, PadananJulat>();
        for (const p of kumpulan.flat()) unik.set(p.laporan_id, p);
        setKeadaan({ fasa: 'siap', padanan: [...unik.values()] });
      } catch {
        if (!dibatalkan) setKeadaan({ fasa: 'ralat' });
      }
    }

    void semak();
    return () => {
      dibatalkan = true;
    };
  }, [jenis, nilai]);

  if (keadaan.fasa === 'memuat') {
    return (
      <p className="muted" style={{ marginBottom: 0 }} aria-live="polite">
        {d.komunitiMenyemak}
      </p>
    );
  }

  if (keadaan.fasa === 'ralat') {
    return (
      <p className="muted" style={{ marginBottom: 0 }}>
        {d.komunitiRalat}
      </p>
    );
  }

  if (keadaan.padanan.length === 0) {
    return (
      <>
        <div className="notis notis--nota">
          <p style={{ marginBottom: 0 }}>{d.komunitiTiada}</p>
        </div>
        <p className="small muted" style={{ marginBottom: 0 }}>
          {d.komunitiPrivasi}
        </p>
      </>
    );
  }

  return (
    <>
      <div className="notis notis--amaran">
        <p style={{ marginBottom: 0 }}>{d.komunitiAda.replace('{n}', String(keadaan.padanan.length))}</p>
      </div>
      <ul className="senarai-ringkas">
        {keadaan.padanan.slice(0, 5).map((p) => (
          <li key={p.laporan_id}>
            <Link href={`/laporan/${p.laporan_id}`}>
              {labelDenganKiraan(p.status, p.bilangan_sokongan, lang)}
            </Link>{' '}
            <span className="muted small">· {p.tarikh_hantar.slice(0, 10)}</span>
          </li>
        ))}
      </ul>
      <p className="small muted" style={{ marginBottom: 0 }}>
        {d.komunitiPrivasi}
      </p>
    </>
  );
}
