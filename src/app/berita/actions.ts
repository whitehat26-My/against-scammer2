'use server';

import { headers } from 'next/headers';
import { SITE_URL } from '@/lib/config';
import { dict, getLang } from '@/lib/i18n';
import { emelSah } from '@/lib/digest';
import { penghantarEmel } from '@/lib/emel';
import { getStore } from '@/lib/laporan/store';
import { hadKadar } from '@/lib/rate-limit';

export type KeadaanDigest = {
  ok?: boolean;
  ralat?: 'emel' | 'pdpa' | 'kadar' | 'umum';
  /** Apa yang pengguna taip. React menetapkan semula borang selepas action. */
  semula?: { emel: string; pdpa: boolean };
};

async function pengenalPermintaan(): Promise<string> {
  const h = await headers();
  return h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'tempatan';
}

/**
 * Langgan digest mingguan (double opt-in).
 *
 * Jawapan kepada pengguna sentiasa sama sama ada alamat itu baharu, sudah
 * menunggu pengesahan, atau sudah disahkan — supaya borang ini tidak boleh
 * digunakan untuk menguji sama ada seseorang berada dalam senarai.
 */
export async function langganDigest(_sebelum: KeadaanDigest, data: FormData): Promise<KeadaanDigest> {
  const emel = String(data.get('emel') ?? '').trim();
  const semula = { emel, pdpa: Boolean(data.get('pdpa')) };

  if (!emelSah(emel)) return { ralat: 'emel', semula };
  if (!semula.pdpa) return { ralat: 'pdpa', semula };

  if (!hadKadar(`digest:${await pengenalPermintaan()}`, 5, 60 * 60).dibenarkan) {
    return { ralat: 'kadar', semula };
  }

  const penghantar = penghantarEmel();
  if (!penghantar) return { ralat: 'umum', semula };

  try {
    const store = await getStore();
    const langganan = await store.langgan(emel);

    // Hanya hantar e-mel pengesahan jika ia belum disahkan.
    if (!langganan.disahkan_pada) {
      const d = dict(await getLang());
      const teks = d.digest.emelTeks
        .replace('{sahkan}', `${SITE_URL}/berita/sahkan?token=${langganan.token_sah}`)
        .replace('{berhenti}', `${SITE_URL}/berita/berhenti?token=${langganan.token_batal}`);
      await penghantar.hantar(langganan.emel, d.digest.emelSubjek, teks);
    }

    return { ok: true };
  } catch {
    return { ralat: 'umum', semula };
  }
}
