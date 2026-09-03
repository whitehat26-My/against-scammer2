'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { getStore } from '@/lib/laporan/store';
import { sahkanBorangBantahan, type KodRalat } from '@/lib/laporan/validasi';
import { hadKadar } from '@/lib/rate-limit';
import { ipKlien } from '@/lib/ip';

export type KeadaanBantahan = {
  ok?: boolean;
  ralat?: Partial<Record<'pembantah_nama' | 'pembantah_emel' | 'hujah' | 'pdpa', KodRalat>>;
  umum?: 'umum' | 'kadar';
  /** Apa yang pengguna taip. React menetapkan semula borang selepas action. */
  semula?: { pembantah_nama: string; pembantah_emel: string; hujah: string; pdpa: boolean };
};

async function pengenalPermintaan(): Promise<string> {
  return ipKlien(await headers());
}

export async function sokongLaporan(data: FormData): Promise<void> {
  const id = data.get('laporan_id');
  if (typeof id !== 'string') return;

  const kadar = hadKadar(`sokong:${await pengenalPermintaan()}`, 10, 15 * 60);
  if (!kadar.dibenarkan) return;

  const store = await getStore();
  // Kiraan sokongan naik; status laporan tidak berubah.
  await store.sokong({ laporan_id: id, penerangan: null, pdpa_persetujuan: true });
  revalidatePath(`/laporan/${id}`);
}

export async function hantarBantahan(_sebelum: KeadaanBantahan, data: FormData): Promise<KeadaanBantahan> {
  const semula = {
    pembantah_nama: String(data.get('pembantah_nama') ?? '').trim(),
    pembantah_emel: String(data.get('pembantah_emel') ?? '').trim(),
    hujah: String(data.get('hujah') ?? '').trim(),
    pdpa: Boolean(data.get('pdpa')),
  };

  const hasil = sahkanBorangBantahan(data);
  if (!hasil.ok) return { ralat: hasil.ralat, semula };

  const kadar = hadKadar(`bantah:${await pengenalPermintaan()}`, 5, 60 * 60);
  if (!kadar.dibenarkan) return { umum: 'kadar', semula };

  try {
    const store = await getStore();
    const bantahan = await store.ciptaBantahan({ ...hasil.nilai, pdpa_persetujuan: true });
    if (!bantahan) return { umum: 'umum', semula };
    revalidatePath(`/laporan/${hasil.nilai.laporan_id}`);
    return { ok: true };
  } catch {
    return { umum: 'umum', semula };
  }
}
