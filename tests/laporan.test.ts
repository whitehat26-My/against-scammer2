import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { akhiranHash, awalanHash, awalanSah, hashNilai, normalkanNilai, PANJANG_AWALAN } from '@/lib/laporan/nilai';
import { bolehTersiar, dalamGiliran } from '@/lib/laporan/types';
import { sahkanBorangBantahan, sahkanBorangLaporan } from '@/lib/laporan/validasi';

let dir: string;

beforeEach(async () => {
  dir = await fs.mkdtemp(path.join(os.tmpdir(), 'laporan-'));
  process.env.DATA_DIR = dir;
});

afterEach(async () => {
  delete process.env.DATA_DIR;
  await fs.rm(dir, { recursive: true, force: true });
});

/** FileStore diimport secara dinamik supaya DATA_DIR dibaca selepas ditetapkan. */
async function storBaharu() {
  const { FileStore } = await import('@/lib/laporan/file-store');
  return new FileStore();
}

const INPUT = {
  jenis_kenalan: 'telefon' as const,
  nilai_kenalan: '012-345 6789',
  kategori_slug: 'macau-scam',
  penerangan: 'Pemanggil mendakwa dari bank dan meminta OTP untuk membatalkan transaksi.',
  bukti: [],
  pelapor_emel: 'pelapor@contoh.my',
  pdpa_persetujuan: true as const,
};

describe('normalisasi nilai', () => {
  it('menghasilkan bentuk yang sama untuk format telefon berbeza', () => {
    const bentuk = ['012-345 6789', '+60123456789', '0123456789', '60 123 456 789'];
    const hasil = new Set(bentuk.map((n) => normalkanNilai('telefon', n)));
    expect(hasil.size).toBe(1);
    expect([...hasil][0]).toBe('+60123456789');
  });

  it('membuang skema dan laluan bagi URL', () => {
    expect(normalkanNilai('url', 'https://www.Contoh-Tipu.xyz/login?a=1')).toBe('contoh-tipu.xyz');
  });

  it('mengekalkan digit sahaja bagi akaun bank', () => {
    expect(normalkanNilai('akaun_bank', '5140 1234 5678')).toBe('514012345678');
  });
});

describe('hash untuk carian k-anonymity', () => {
  it('konsisten untuk nilai yang sama', async () => {
    expect(await hashNilai('telefon', '012-345 6789')).toBe(await hashNilai('telefon', '+60123456789'));
  });

  it('berbeza mengikut jenis kenalan', async () => {
    expect(await hashNilai('telefon', '0123456789')).not.toBe(await hashNilai('akaun_bank', '0123456789'));
  });

  it('awalan pendek supaya pelayan tidak dapat menentukan carian', async () => {
    const hash = await hashNilai('telefon', '0123456789');
    expect(awalanHash(hash)).toHaveLength(PANJANG_AWALAN);
    expect(akhiranHash(hash)).toHaveLength(64 - PANJANG_AWALAN);
    expect(awalanHash(hash) + akhiranHash(hash)).toBe(hash);
    expect(awalanSah(awalanHash(hash))).toBe(true);
    expect(awalanSah('ZZZZZ')).toBe(false);
  });
});

describe('kitaran hayat laporan', () => {
  it('laporan baharu bermula belum disemak dan tidak tersiar', async () => {
    const store = await storBaharu();
    const laporan = await store.cipta(INPUT);

    expect(laporan.status).toBe('belum_disemak');
    expect(bolehTersiar(laporan)).toBe(false);
    expect(dalamGiliran(laporan)).toBe(true);
    expect(await store.julatIkutAwalan(awalanHash(laporan.nilai_hash))).toEqual([]);
  });

  it('hanya tersiar selepas moderator mengambil tindakan', async () => {
    const store = await storBaharu();
    const laporan = await store.cipta(INPUT);

    const diterima = await store.tindakanModerator({
      laporan_id: laporan.id,
      tindakan: 'terima',
      moderator_id: 'aisyah',
      sebab: null,
    });

    expect(diterima?.status).toBe('dilaporkan_komuniti');
    expect(diterima?.disemak_oleh).toBe('aisyah');
    expect(diterima?.disemak_pada).not.toBeNull();
    expect(bolehTersiar(diterima!)).toBe(true);

    const padanan = await store.julatIkutAwalan(awalanHash(laporan.nilai_hash));
    expect(padanan).toHaveLength(1);
    expect(padanan[0]?.hash_suffix).toBe(akhiranHash(laporan.nilai_hash));
  });

  it('julat mengembalikan cap jari sahaja, bukan nilai yang dilaporkan', async () => {
    const store = await storBaharu();
    const laporan = await store.cipta(INPUT);
    await store.tindakanModerator({ laporan_id: laporan.id, tindakan: 'terima', moderator_id: 'a', sebab: null });

    const padanan = await store.julatIkutAwalan(awalanHash(laporan.nilai_hash));
    const teks = JSON.stringify(padanan);
    expect(teks).not.toContain('60123456789');
    expect(teks).not.toContain('pelapor@contoh.my');
  });

  it('sokongan menaikkan kiraan tetapi tidak menaik taraf status', async () => {
    const store = await storBaharu();
    const laporan = await store.cipta(INPUT);
    await store.tindakanModerator({ laporan_id: laporan.id, tindakan: 'terima', moderator_id: 'a', sebab: null });

    for (let i = 0; i < 9; i += 1) {
      await store.sokong({ laporan_id: laporan.id, penerangan: null, pdpa_persetujuan: true });
    }
    const selepas = await store.dapatkan(laporan.id);
    expect(selepas?.bilangan_sokongan).toBe(10);
    expect(selepas?.status).toBe('dilaporkan_komuniti');
  });

  it('laporan yang ditolak keluar daripada giliran dan tidak pernah tersiar', async () => {
    const store = await storBaharu();
    const laporan = await store.cipta(INPUT);
    await store.tindakanModerator({ laporan_id: laporan.id, tindakan: 'tolak', moderator_id: 'a', sebab: 'tidak jelas' });

    const selepas = await store.dapatkan(laporan.id);
    expect(bolehTersiar(selepas!)).toBe(false);
    expect(dalamGiliran(selepas!)).toBe(false);
    expect(await store.senarai({ giliran: true })).toHaveLength(0);
    expect(await store.julatIkutAwalan(awalanHash(laporan.nilai_hash))).toEqual([]);
  });

  it('laporan yang dibuang berhenti dipaparkan', async () => {
    const store = await storBaharu();
    const laporan = await store.cipta(INPUT);
    await store.tindakanModerator({ laporan_id: laporan.id, tindakan: 'terima', moderator_id: 'a', sebab: null });
    await store.tindakanModerator({ laporan_id: laporan.id, tindakan: 'buang', moderator_id: 'a', sebab: 'fitnah' });

    expect(await store.julatIkutAwalan(awalanHash(laporan.nilai_hash))).toEqual([]);
  });

  it('bantahan menandakan laporan sebagai dipertikai, bukan membuangnya', async () => {
    const store = await storBaharu();
    const laporan = await store.cipta(INPUT);
    await store.tindakanModerator({ laporan_id: laporan.id, tindakan: 'terima', moderator_id: 'a', sebab: null });

    const bantahan = await store.ciptaBantahan({
      laporan_id: laporan.id,
      pembantah_nama: 'Nurul',
      pembantah_emel: 'nurul@contoh.my',
      hujah: 'Nombor ini milik kedai saya dan telah dipalsukan oleh pihak ketiga.',
      pdpa_persetujuan: true,
    });

    expect(bantahan).toBeDefined();
    const selepas = await store.dapatkan(laporan.id);
    expect(selepas?.status).toBe('dipertikai');
    expect(bolehTersiar(selepas!)).toBe(true);
    expect(await store.bantahanUntuk(laporan.id)).toHaveLength(1);
  });

  it('tidak menerima bantahan terhadap laporan yang belum tersiar', async () => {
    const store = await storBaharu();
    const laporan = await store.cipta(INPUT);
    const bantahan = await store.ciptaBantahan({
      laporan_id: laporan.id,
      pembantah_nama: 'Nurul',
      pembantah_emel: 'nurul@contoh.my',
      hujah: 'Nombor ini milik kedai saya dan telah dipalsukan oleh pihak ketiga.',
      pdpa_persetujuan: true,
    });
    expect(bantahan).toBeUndefined();
  });

  it('merekod setiap tindakan moderator dalam log audit', async () => {
    const store = await storBaharu();
    const laporan = await store.cipta(INPUT);
    await store.tindakanModerator({ laporan_id: laporan.id, tindakan: 'terima', moderator_id: 'aisyah', sebab: 'jelas' });
    await store.tindakanModerator({ laporan_id: laporan.id, tindakan: 'buang', moderator_id: 'farid', sebab: 'rayuan' });

    const log = await store.logModerator();
    expect(log).toHaveLength(2);
    expect(log[0]?.moderator_id).toBe('farid');
    expect(log[0]?.tindakan).toBe('buang');
    expect(log[1]?.moderator_id).toBe('aisyah');
    expect(log.every((l) => l.tarikh && l.laporan_id === laporan.id)).toBe(true);
  });
});

describe('langganan digest (double opt-in)', () => {
  it('langganan baharu belum disahkan', async () => {
    const store = await storBaharu();
    const langganan = await store.langgan('Orang@Contoh.MY');
    expect(langganan.emel).toBe('orang@contoh.my');
    expect(langganan.disahkan_pada).toBeNull();
    expect(await store.bilanganLangganan()).toBe(0);
  });

  it('hanya aktif selepas token pengesahan digunakan', async () => {
    const store = await storBaharu();
    const langganan = await store.langgan('orang@contoh.my');
    expect(await store.sahkanLangganan(langganan.token_sah)).toBe(true);
    expect(await store.bilanganLangganan()).toBe(1);
  });

  it('menolak token pengesahan yang tidak sah', async () => {
    const store = await storBaharu();
    await store.langgan('orang@contoh.my');
    expect(await store.sahkanLangganan('token-palsu')).toBe(false);
    expect(await store.sahkanLangganan('3f2504e0-4f89-11d3-9a0c-0305e82c3301')).toBe(false);
    expect(await store.bilanganLangganan()).toBe(0);
  });

  it('permintaan berulang menjana token baharu dan membatalkan yang lama', async () => {
    const store = await storBaharu();
    const pertama = await store.langgan('orang@contoh.my');
    const kedua = await store.langgan('orang@contoh.my');

    expect(kedua.id).toBe(pertama.id);
    expect(kedua.token_sah).not.toBe(pertama.token_sah);
    expect(await store.sahkanLangganan(pertama.token_sah)).toBe(false);
    expect(await store.sahkanLangganan(kedua.token_sah)).toBe(true);
  });

  it('tidak menghantar pengesahan semula untuk langganan yang sudah disahkan', async () => {
    const store = await storBaharu();
    const langganan = await store.langgan('orang@contoh.my');
    await store.sahkanLangganan(langganan.token_sah);

    const lagi = await store.langgan('orang@contoh.my');
    expect(lagi.disahkan_pada).not.toBeNull();
    expect(lagi.token_sah).toBe(langganan.token_sah);
  });

  it('berhenti melanggan membuang alamat sepenuhnya', async () => {
    const store = await storBaharu();
    const langganan = await store.langgan('orang@contoh.my');
    await store.sahkanLangganan(langganan.token_sah);

    expect(await store.berhentiLangganan(langganan.token_batal)).toBe(true);
    expect(await store.bilanganLangganan()).toBe(0);
    // Token yang sama tidak boleh digunakan dua kali.
    expect(await store.berhentiLangganan(langganan.token_batal)).toBe(false);
  });
});

describe('validasi borang', () => {
  function borang(ubah: Record<string, string> = {}): FormData {
    const data = new FormData();
    data.set('jenis_kenalan', 'telefon');
    data.set('nilai_kenalan', '0123456789');
    data.set('kategori_slug', 'macau-scam');
    data.set('penerangan', 'Pemanggil mendakwa dari bank dan meminta OTP saya.');
    data.set('pdpa', 'ya');
    for (const [k, v] of Object.entries(ubah)) {
      if (v === '') data.delete(k);
      else data.set(k, v);
    }
    return data;
  }

  it('menerima borang yang lengkap', () => {
    const hasil = sahkanBorangLaporan(borang(), ['macau-scam']);
    expect(hasil.ok).toBe(true);
  });

  it('menolak tanpa persetujuan PDPA', () => {
    const hasil = sahkanBorangLaporan(borang({ pdpa: '' }), ['macau-scam']);
    expect(hasil.ok).toBe(false);
    if (!hasil.ok) expect(hasil.ralat.pdpa).toBe('pdpa');
  });

  it('menolak kategori di luar taksonomi', () => {
    const hasil = sahkanBorangLaporan(borang({ kategori_slug: 'kategori-rekaan' }), ['macau-scam']);
    expect(hasil.ok).toBe(false);
    if (!hasil.ok) expect(hasil.ralat.kategori_slug).toBe('tidak_sah');
  });

  it('menolak penerangan yang terlalu pendek', () => {
    const hasil = sahkanBorangLaporan(borang({ penerangan: 'scammer' }), ['macau-scam']);
    expect(hasil.ok).toBe(false);
    if (!hasil.ok) expect(hasil.ralat.penerangan).toBe('terlalu_pendek');
  });

  it('menerima laporan tanpa nama', () => {
    const hasil = sahkanBorangLaporan(borang({ pelapor_emel: '' }), ['macau-scam']);
    expect(hasil.ok).toBe(true);
    if (hasil.ok) expect(hasil.nilai.pelapor_emel).toBeNull();
  });

  it('bantahan memerlukan kontak supaya kami boleh membalas', () => {
    const data = new FormData();
    data.set('laporan_id', 'abc');
    data.set('hujah', 'Nombor ini milik kedai saya dan telah dipalsukan oleh pihak ketiga.');
    data.set('pdpa', 'ya');
    const hasil = sahkanBorangBantahan(data);
    expect(hasil.ok).toBe(false);
    if (!hasil.ok) {
      expect(hasil.ralat.pembantah_nama).toBe('wajib');
      expect(hasil.ralat.pembantah_emel).toBe('wajib');
    }
  });
});
