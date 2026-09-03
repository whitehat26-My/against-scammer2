'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { listCategorySlugs } from '@/lib/content';
import { MAKS_FAIL, simpanBukti } from '@/lib/laporan/bukti';
import { getStore } from '@/lib/laporan/store';
import { nilaiMentah, sahkanBorangLaporan, type KodRalat, type Medan, type NilaiMentah } from '@/lib/laporan/validasi';
import { hadKadar } from '@/lib/rate-limit';
import { captchaWajib, captchaDikonfigurasi, perangkapDilanggar, sahkanCaptcha } from '@/lib/captcha';

export type RalatUmum =
  | 'umum'
  | 'kadar'
  | 'bukti_jenis'
  | 'bukti_saiz'
  | 'bukti_banyak'
  | 'malware'
  | 'captcha'
  | 'captcha_belum_sedia'
  | 'bot';

export type KeadaanBorang = {
  ralat?: Partial<Record<Medan, KodRalat>>;
  umum?: RalatUmum;
  /** Apa yang pengguna taip, dikembalikan supaya borang tidak kosong semula. */
  semula?: NilaiMentah;
  /**
   * Nonce bagi setiap jawapan. Komponen menggunakannya sebagai `key` pada
   * <select> supaya elemen itu dipasang semula selepas React menetapkan
   * semula borang — jika tidak, pilihan pengguna hilang.
   */
  cap?: string;
};

/** Pengenal kasar untuk had kadar sahaja. Ia tidak pernah disimpan — lihat src/lib/rate-limit.ts. */
async function pengenalPermintaan(): Promise<string> {
  const h = await headers();
  return h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'tempatan';
}

export async function hantarLaporan(_sebelum: KeadaanBorang, data: FormData): Promise<KeadaanBorang> {
  const semula = nilaiMentah(data);
  const cap = crypto.randomUUID();

  // 1. Perangkap bot yang tidak memerlukan penyedia luar.
  if (perangkapDilanggar(String(data.get('laman_web') ?? ''), Number(data.get('dimuat_pada') ?? 0))) {
    return { umum: 'bot', semula, cap };
  }

  const hasil = sahkanBorangLaporan(data, listCategorySlugs());
  if (!hasil.ok) return { ralat: hasil.ralat, semula, cap };

  const ip = await pengenalPermintaan();
  const kadar = hadKadar(ip, 5, 15 * 60);
  if (!kadar.dibenarkan) return { umum: 'kadar', semula, cap };

  // 2. CAPTCHA. Gagal-tutup: dalam produksi tanpa penyedia, tiada penghantaran.
  if (captchaWajib() && !captchaDikonfigurasi()) {
    return { umum: 'captcha_belum_sedia', semula, cap };
  }
  if (captchaDikonfigurasi()) {
    const token = String(data.get('cf-turnstile-response') ?? data.get('h-captcha-response') ?? '');
    if ((await sahkanCaptcha(token, ip === 'tempatan' ? undefined : ip)) !== 'lulus') {
      return { umum: 'captcha', semula, cap };
    }
  }

  const failBukti = data.getAll('bukti').filter((f): f is File => f instanceof File && f.size > 0);
  if (failBukti.length > MAKS_FAIL) return { umum: 'bukti_banyak', semula, cap };

  const bukti: string[] = [];
  for (const fail of failBukti) {
    const simpan = await simpanBukti(fail);
    if ('ralat' in simpan) {
      const peta = { saiz: 'bukti_saiz', jenis: 'bukti_jenis', malware: 'malware' } as const;
      return { umum: peta[simpan.ralat], semula, cap };
    }
    bukti.push(simpan.nama);
  }

  try {
    const store = await getStore();
    await store.cipta({ ...hasil.nilai, bukti, pdpa_persetujuan: true });
  } catch {
    return { umum: 'umum', semula, cap };
  }

  redirect('/lapor/terima-kasih');
}
