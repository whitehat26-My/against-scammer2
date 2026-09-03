import { buangBukti } from './bukti';
import type { Store } from './store';
import type { Laporan } from './types';

/**
 * Dasar simpanan data selaras PDPA.
 *
 * Prinsipnya: data peribadi disimpan hanya selagi ia diperlukan untuk tujuan
 * asalnya. Laporan yang diterbitkan kekal sebagai amaran, tetapi kontak
 * pelapor dan fail bukti dibuang apabila tempoh simpannya tamat.
 */

export const HARI = 24 * 60 * 60 * 1000;

/** Laporan yang ditolak tidak pernah tersiar — tiada sebab menyimpannya lama. */
export const HARI_SIMPAN_DITOLAK = 90;
/** Laporan yang dibuang telah dikeluarkan daripada paparan awam. */
export const HARI_SIMPAN_DIBUANG = 30;

export type KeputusanPembersihan = {
  laporan_dipadam: number;
  data_peribadi_dipadam: number;
  bukti_dipadam: number;
};

function lebihLama(cap: string | null, hari: number, sekarang: number): boolean {
  if (!cap) return false;
  return sekarang - new Date(cap).getTime() > hari * HARI;
}

export function patutDipadamSepenuhnya(laporan: Laporan, sekarang = Date.now()): boolean {
  if (lebihLama(laporan.ditolak_pada, HARI_SIMPAN_DITOLAK, sekarang)) return true;
  if (lebihLama(laporan.dibuang_pada, HARI_SIMPAN_DIBUANG, sekarang)) return true;
  return false;
}

/**
 * Laporan tersiar kekal sebagai amaran selepas tempoh simpan, tetapi tanpa
 * apa-apa yang mengenal pasti pelapor.
 */
export function patutDilucutDataPeribadi(laporan: Laporan, sekarang = Date.now()): boolean {
  if (patutDipadamSepenuhnya(laporan, sekarang)) return false;
  const tamat = new Date(`${laporan.simpan_sehingga}T00:00:00Z`).getTime();
  if (Number.isNaN(tamat) || sekarang < tamat) return false;
  return laporan.pelapor_emel !== null || laporan.bukti.length > 0;
}

/**
 * Jalankan pembersihan. Direka untuk dipanggil daripada kerja berjadual
 * harian (cron / Supabase scheduled function) atau butang dalam papan pemuka.
 */
export async function jalankanPembersihan(store: Store, sekarang = Date.now()): Promise<KeputusanPembersihan> {
  const semua = await store.senarai({ had: 5000 });
  const keputusan: KeputusanPembersihan = { laporan_dipadam: 0, data_peribadi_dipadam: 0, bukti_dipadam: 0 };

  for (const laporan of semua) {
    if (patutDipadamSepenuhnya(laporan, sekarang)) {
      for (const nama of laporan.bukti) {
        await buangBukti(nama);
        keputusan.bukti_dipadam += 1;
      }
      await store.padamLaporan(laporan.id);
      keputusan.laporan_dipadam += 1;
      continue;
    }

    if (patutDilucutDataPeribadi(laporan, sekarang)) {
      for (const nama of laporan.bukti) {
        await buangBukti(nama);
        keputusan.bukti_dipadam += 1;
      }
      await store.padamDataPeribadi(laporan.id);
      keputusan.data_peribadi_dipadam += 1;
    }
  }

  return keputusan;
}
