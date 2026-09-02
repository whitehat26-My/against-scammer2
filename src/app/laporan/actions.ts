'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { getStore } from '@/lib/laporan/store';
import { sahkanBorangBantahan, type KodRalat } from '@/lib/laporan/validasi';
import { hadKadar } from '@/lib/rate-limit';

export type KeadaanBantahan = {
  ok?: boolean;
  ralat?: Partial<Record<'pembantah_nama' | 'pembantah_emel' | 'hujah' | 'pdpa', KodRalat>>;
  umum?: 'umum' | 'kadar';
};

async function pengenalPermintaan(): Promise<string> {
  const h = await headers();
  return h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'tempatan';
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
  const hasil = sahkanBorangBantahan(data);
  if (!hasil.ok) return { ralat: hasil.ralat };

  const kadar = hadKadar(`bantah:${await pengenalPermintaan()}`, 5, 60 * 60);
  if (!kadar.dibenarkan) return { umum: 'kadar' };

  try {
    const store = await getStore();
    const bantahan = await store.ciptaBantahan({ ...hasil.nilai, pdpa_persetujuan: true });
    if (!bantahan) return { umum: 'umum' };
    revalidatePath(`/laporan/${hasil.nilai.laporan_id}`);
    return { ok: true };
  } catch {
    return { umum: 'umum' };
  }
}
