'use server';

import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { penghantarEmel } from '@/lib/emel';
import { buangBukti } from '@/lib/laporan/bukti';
import { jalankanPembersihan } from '@/lib/laporan/pembersihan';
import { sidikJariPeranti } from '@/lib/kripto';
import { getStore } from '@/lib/laporan/store';
import { isTindakanModerator } from '@/lib/laporan/types';
import {
  bacaPraSesi,
  ciptaPraSesi,
  ciptaToken,
  COOKIE_SESI,
  moderatorSemasa,
  sahkanKelayakan,
  sahkanTotpModerator,
  totpDiperlukan,
} from '@/lib/moderator';
import { hadKadar } from '@/lib/rate-limit';
import { ipKlien } from '@/lib/ip';

export type KeadaanMasuk = {
  gagal?: boolean;
  /** Kegagalan khusus kod TOTP, supaya mesej boleh membezakannya. */
  totpGagal?: boolean;
  perluTotp?: boolean;
  /** ID yang dimasukkan, dikembalikan supaya pengguna tidak perlu menaipnya semula. */
  id?: string;
  /** Token pra-sesi bertandatangan untuk langkah kedua. */
  pra?: string;
};

type Konteks = { ip: string; ejen: string };

async function konteksPermintaan(): Promise<Konteks> {
  const h = await headers();
  return { ip: ipKlien(h), ejen: h.get('user-agent') ?? 'tidak diketahui' };
}

export async function logMasuk(_sebelum: KeadaanMasuk, data: FormData): Promise<KeadaanMasuk> {
  const kodTotp = String(data.get('totp') ?? '');
  const { ip, ejen } = await konteksPermintaan();

  // Hadkan cubaan meneka token dan kod TOTP.
  if (!hadKadar(`masuk:${ip}`, 10, 15 * 60).dibenarkan) return { gagal: true };

  const store = await getStore();

  // Langkah kedua: token pra-sesi bertandatangan menggantikan faktor pertama,
  // supaya token moderator tidak perlu ditaip atau dihantar semula.
  const idPra = bacaPraSesi(String(data.get('pra') ?? ''));
  const id = idPra ?? String(data.get('id') ?? '').trim();

  if (!idPra) {
    const token = String(data.get('token') ?? '');
    if (!id || !token || !sahkanKelayakan(id, token)) {
      await store.catatPeristiwaAdmin({ moderator_id: id || 'tidak diketahui', tindakan: 'log_masuk_gagal', sebab: 'kelayakan salah', ip });
      return { gagal: true, id };
    }
  }

  // Faktor kedua. Borang meminta kod hanya selepas kelayakan pertama betul,
  // supaya senarai akaun yang mempunyai MFA tidak bocor kepada penyerang.
  if (totpDiperlukan(id)) {
    if (!kodTotp) return { perluTotp: true, id, pra: ciptaPraSesi(id) };
    if (!sahkanTotpModerator(id, kodTotp)) {
      await store.catatPeristiwaAdmin({ moderator_id: id, tindakan: 'log_masuk_gagal', sebab: 'kod TOTP salah', ip });
      return { totpGagal: true, perluTotp: true, id, pra: ciptaPraSesi(id) };
    }
  }

  // Amaran peranti baharu.
  const sidikJari = sidikJariPeranti(ejen, ip);
  if (!(await store.perantiDikenali(id, sidikJari))) {
    await store.catatPeristiwaAdmin({ moderator_id: id, tindakan: 'peranti_baharu', sebab: `sidik jari ${sidikJari.slice(0, 8)}`, ip });
    const penghantar = penghantarEmel();
    const amaranKe = process.env.MODERATOR_EMEL_AMARAN?.trim();
    if (penghantar && amaranKe) {
      await penghantar.hantar(
        amaranKe,
        'Log masuk moderator dari peranti baharu',
        `Akaun: ${id}\nIP: ${ip}\nMasa: ${new Date().toISOString()}\n\nJika ini bukan anda, tukar token akaun tersebut sekarang.`,
      );
    }
  }
  await store.daftarPeranti(id, sidikJari);
  await store.catatPeristiwaAdmin({ moderator_id: id, tindakan: 'log_masuk', sebab: null, ip });

  const kuki = await cookies();
  kuki.set(COOKIE_SESI, ciptaToken(id), {
    path: '/',
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 4,
  });
  redirect('/moderasi');
}

export async function logKeluar(): Promise<void> {
  const kuki = await cookies();
  kuki.delete(COOKIE_SESI);
  redirect('/moderasi');
}

export async function tindakanModerasi(data: FormData): Promise<void> {
  const moderator = await moderatorSemasa();
  if (!moderator) redirect('/moderasi');

  const laporanId = String(data.get('laporan_id') ?? '');
  const tindakan = String(data.get('tindakan') ?? '');
  const sebabMentah = String(data.get('sebab') ?? '').trim();
  if (!laporanId || !isTindakanModerator(tindakan)) return;
  // Peristiwa keselamatan tidak boleh dicetuskan melalui borang moderasi.
  const dibenarkan = ['terima', 'tolak', 'tanda_dipertikai', 'buang', 'buka_semula', 'padam_data_peribadi'];
  if (!dibenarkan.includes(tindakan)) return;

  const { ip } = await konteksPermintaan();
  const store = await getStore();

  // Permintaan pembuangan data di bawah PDPA: laporan kekal sebagai amaran,
  // tetapi apa yang mengenal pasti pelapor dibuang serta-merta.
  if (tindakan === 'padam_data_peribadi') {
    const laporan = await store.dapatkan(laporanId);
    for (const nama of laporan?.bukti ?? []) await buangBukti(nama);
    await store.padamDataPeribadi(laporanId);
    await store.catatPeristiwaAdmin({
      moderator_id: moderator.id,
      tindakan: 'padam_data_peribadi',
      sebab: sebabMentah === '' ? `laporan ${laporanId.slice(0, 8)}` : sebabMentah.slice(0, 500),
      ip,
    });
    revalidatePath('/moderasi');
    revalidatePath(`/laporan/${laporanId}`);
    return;
  }

  await store.tindakanModerator({
    laporan_id: laporanId,
    tindakan,
    moderator_id: moderator.id,
    sebab: sebabMentah === '' ? null : sebabMentah.slice(0, 500),
    ip,
  });

  revalidatePath('/moderasi');
  revalidatePath(`/laporan/${laporanId}`);
}

/**
 * Jalankan dasar simpanan data secara manual.
 * Dalam produksi ini patut dijadualkan harian; butang ini untuk pengesahan
 * dan untuk pemasangan yang belum ada penjadual.
 */
export async function jalankanPembersihanSekarang(): Promise<void> {
  const moderator = await moderatorSemasa();
  if (!moderator) redirect('/moderasi');

  const { ip } = await konteksPermintaan();
  const store = await getStore();
  const hasil = await jalankanPembersihan(store);
  await store.catatPeristiwaAdmin({
    moderator_id: moderator.id,
    tindakan: 'padam_data_peribadi',
    sebab: `pembersihan berjadual: ${hasil.laporan_dipadam} laporan, ${hasil.data_peribadi_dipadam} kontak, ${hasil.bukti_dipadam} bukti`,
    ip,
  });
  revalidatePath('/moderasi');
}
