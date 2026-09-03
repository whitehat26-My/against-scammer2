import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { awalanHash } from '@/lib/laporan/nilai';
import { bolehTersiar } from '@/lib/laporan/types';

/**
 * Ujian integrasi untuk storan Postgres.
 *
 * Dilangkau jika `DATABASE_URL` tidak ditetapkan supaya `npm test` tetap
 * berjalan tanpa pangkalan data. Untuk menjalankannya:
 *
 *   createdb portal_scam
 *   psql portal_scam -f db/schema.sql
 *   DATABASE_URL=postgres://…/portal_scam npm test
 */
const URL_DB = process.env.DATABASE_URL;

describe.skipIf(!URL_DB)('storan Postgres', () => {
  let store: import('@/lib/laporan/pg-store').PgStore;

  const input = {
    jenis_kenalan: 'telefon' as const,
    nilai_kenalan: '019-888 7766',
    kategori_slug: 'macau-scam',
    penerangan: 'Pemanggil mendakwa dari bank dan meminta OTP untuk membatalkan transaksi.',
    bukti: [],
    pelapor_emel: null,
    pdpa_persetujuan: true as const,
  };

  beforeAll(async () => {
    const { PgStore } = await import('@/lib/laporan/pg-store');
    store = new PgStore(URL_DB as string);
  });

  it('menyimpan kontak pelapor dalam bentuk bersulit', async () => {
    const laporan = await store.cipta({ ...input, pelapor_emel: 'pelapor@contoh.my' });

    const { Pool } = await import('pg');
    const pool = new Pool({ connectionString: URL_DB });
    const { rows } = await pool.query<{ pelapor_emel: string }>('select pelapor_emel from report where id = $1', [laporan.id]);
    await pool.end();

    expect(rows[0]?.pelapor_emel).not.toContain('pelapor@contoh.my');
    expect(rows[0]?.pelapor_emel?.startsWith('enc:v1:')).toBe(true);
    expect((await store.dapatkan(laporan.id))?.pelapor_emel).toBe('pelapor@contoh.my');
  });

  it('merekod peristiwa admin dengan IP dan menjejaki peranti', async () => {
    await store.catatPeristiwaAdmin({ moderator_id: 'aisyah', tindakan: 'log_masuk', sebab: null, ip: '203.0.113.9' });
    const log = await store.logModerator(5);
    expect(log[0]?.tindakan).toBe('log_masuk');
    expect(log[0]?.ip).toBe('203.0.113.9');

    expect(await store.perantiDikenali('aisyah', 'e'.repeat(32))).toBe(false);
    await store.daftarPeranti('aisyah', 'e'.repeat(32));
    expect(await store.perantiDikenali('aisyah', 'e'.repeat(32))).toBe(true);
  });

  it('padam data peribadi mengekalkan laporan sebagai amaran', async () => {
    const laporan = await store.cipta({ ...input, pelapor_emel: 'pelapor@contoh.my', bukti: ['fail.jpg'] });
    await store.padamDataPeribadi(laporan.id);
    const selepas = await store.dapatkan(laporan.id);
    expect(selepas?.pelapor_emel).toBeNull();
    expect(selepas?.bukti).toEqual([]);
    expect(selepas?.penerangan).toBe(input.penerangan);
  });

  afterAll(async () => {
    const { Pool } = await import('pg');
    const pool = new Pool({ connectionString: URL_DB });
    await pool.query('delete from admin_device');
    await pool.query('delete from moderator_log');
    await pool.query('delete from dispute');
    await pool.query('delete from report');
    await pool.query('delete from digest_subscriber');
    await pool.end();
  });

  it('menyimpan laporan baharu sebagai belum disemak dan tidak tersiar', async () => {
    const laporan = await store.cipta(input);
    expect(laporan.status).toBe('belum_disemak');
    expect(laporan.nilai_kenalan).toBe('+60198887766');
    expect(bolehTersiar(laporan)).toBe(false);
    expect(await store.julatIkutAwalan(awalanHash(laporan.nilai_hash))).toEqual([]);
  });

  it('menerbitkan hanya selepas tindakan moderator, dan merekod log audit', async () => {
    const laporan = await store.cipta(input);
    const diterima = await store.tindakanModerator({
      laporan_id: laporan.id,
      tindakan: 'terima',
      moderator_id: 'aisyah',
      sebab: 'jelas',
    });

    expect(diterima?.status).toBe('dilaporkan_komuniti');
    expect(bolehTersiar(diterima!)).toBe(true);

    const padanan = await store.julatIkutAwalan(awalanHash(laporan.nilai_hash));
    expect(padanan.some((p) => p.laporan_id === laporan.id)).toBe(true);

    const log = await store.logModerator(10);
    expect(log[0]?.tindakan).toBe('terima');
    expect(log[0]?.laporan_id).toBe(laporan.id);
  });

  it('sokongan menaikkan kiraan tanpa menukar status', async () => {
    const laporan = await store.cipta(input);
    await store.tindakanModerator({
      laporan_id: laporan.id,
      tindakan: 'terima',
      moderator_id: 'aisyah',
      sebab: null,
    });
    const selepas = await store.sokong({ laporan_id: laporan.id, penerangan: null, pdpa_persetujuan: true });
    expect(selepas?.bilangan_sokongan).toBe(2);
    expect(selepas?.status).toBe('dilaporkan_komuniti');
  });

  it('bantahan menukar status kepada dipertikai', async () => {
    const laporan = await store.cipta(input);
    await store.tindakanModerator({
      laporan_id: laporan.id,
      tindakan: 'terima',
      moderator_id: 'aisyah',
      sebab: null,
    });
    const bantahan = await store.ciptaBantahan({
      laporan_id: laporan.id,
      pembantah_nama: 'Nurul',
      pembantah_emel: 'nurul@contoh.my',
      hujah: 'Nombor ini milik kedai saya dan telah dipalsukan oleh pihak ketiga.',
      pdpa_persetujuan: true,
    });

    expect(bantahan?.laporan_id).toBe(laporan.id);
    expect((await store.dapatkan(laporan.id))?.status).toBe('dipertikai');
    expect(await store.bantahanUntuk(laporan.id)).toHaveLength(1);
  });

  it('langganan digest mengikut aliran double opt-in', async () => {
    const langganan = await store.langgan('Orang@Contoh.MY');
    expect(langganan.emel).toBe('orang@contoh.my');
    expect(langganan.disahkan_pada).toBeNull();
    expect(await store.bilanganLangganan()).toBe(0);

    const kedua = await store.langgan('orang@contoh.my');
    expect(kedua.id).toBe(langganan.id);
    expect(kedua.token_sah).not.toBe(langganan.token_sah);
    expect(await store.sahkanLangganan(langganan.token_sah)).toBe(false);
    expect(await store.sahkanLangganan(kedua.token_sah)).toBe(true);
    expect(await store.bilanganLangganan()).toBe(1);

    expect(await store.berhentiLangganan(kedua.token_batal)).toBe(true);
    expect(await store.bilanganLangganan()).toBe(0);
  });

  it('laporan yang dibuang tidak lagi muncul dalam carian julat', async () => {
    const laporan = await store.cipta(input);
    const moderator = 'aisyah';
    await store.tindakanModerator({ laporan_id: laporan.id, tindakan: 'terima', moderator_id: moderator, sebab: null });
    await store.tindakanModerator({ laporan_id: laporan.id, tindakan: 'buang', moderator_id: moderator, sebab: 'fitnah' });

    const padanan = await store.julatIkutAwalan(awalanHash(laporan.nilai_hash));
    expect(padanan.some((p) => p.laporan_id === laporan.id)).toBe(false);
  });
});
