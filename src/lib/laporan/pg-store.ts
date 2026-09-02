import { Pool } from 'pg';
import type { DigestStore, LaporanStore, PilihanSenarai, TindakanInput } from './store';
import type {
  Bantahan,
  BantahanInput,
  JenisKenalan,
  Laporan,
  LaporanInput,
  LogModerator,
  PadananJulat,
  SokonganInput,
} from './types';
import { akhiranHash, awalanSah, hashNilai, normalkanNilai } from './nilai';
import type { ReportStatus } from '@/lib/status';
import { normalkanEmel, tokenSah, type Langganan } from '@/lib/digest';

type BarisLaporan = {
  id: string;
  jenis_kenalan: JenisKenalan;
  nilai_kenalan: string;
  nilai_hash: string;
  kategori_slug: string | null;
  penerangan: string;
  bukti_url: string[];
  status: ReportStatus;
  bilangan_sokongan: number;
  pelapor_emel: string | null;
  pdpa_persetujuan: boolean;
  pdpa_persetujuan_pada: Date;
  simpan_sehingga: Date;
  disemak_oleh: string | null;
  disemak_pada: Date | null;
  catatan_moderator: string | null;
  ditolak_pada: Date | null;
  dibuang_pada: Date | null;
  tarikh_hantar: Date;
  dikemaskini_pada: Date;
};

const iso = (nilai: Date | null): string | null => (nilai ? nilai.toISOString() : null);

function keLaporan(baris: BarisLaporan): Laporan {
  return {
    id: baris.id,
    jenis_kenalan: baris.jenis_kenalan,
    nilai_kenalan: baris.nilai_kenalan,
    nilai_hash: baris.nilai_hash,
    kategori_slug: baris.kategori_slug,
    penerangan: baris.penerangan,
    bukti: baris.bukti_url ?? [],
    status: baris.status,
    bilangan_sokongan: Number(baris.bilangan_sokongan),
    pelapor_emel: baris.pelapor_emel,
    pdpa_persetujuan: baris.pdpa_persetujuan,
    pdpa_persetujuan_pada: baris.pdpa_persetujuan_pada.toISOString(),
    simpan_sehingga: baris.simpan_sehingga.toISOString().slice(0, 10),
    disemak_oleh: baris.disemak_oleh,
    disemak_pada: iso(baris.disemak_pada),
    catatan_moderator: baris.catatan_moderator,
    ditolak_pada: iso(baris.ditolak_pada),
    dibuang_pada: iso(baris.dibuang_pada),
    tarikh_hantar: baris.tarikh_hantar.toISOString(),
    dikemaskini_pada: baris.dikemaskini_pada.toISOString(),
  };
}

/** Syarat "tersiar" yang sama seperti `bolehTersiar()`, tetapi dalam SQL. */
const SYARAT_TERSIAR = `
  disemak_pada is not null
  and ditolak_pada is null
  and dibuang_pada is null
  and status in ('dilaporkan_komuniti', 'dipertikai')
`;

/**
 * Storan Postgres/Supabase mengikut `db/schema.sql`.
 * Aktif apabila `DATABASE_URL` ditetapkan.
 */
export class PgStore implements LaporanStore, DigestStore {
  private readonly pool: Pool;

  constructor(connectionString: string) {
    this.pool = new Pool({
      connectionString,
      max: 5,
      ssl: connectionString.includes('localhost') || connectionString.includes('127.0.0.1')
        ? undefined
        : { rejectUnauthorized: true },
    });
  }

  async cipta(input: LaporanInput): Promise<Laporan> {
    const nilai = normalkanNilai(input.jenis_kenalan, input.nilai_kenalan);
    const hash = await hashNilai(input.jenis_kenalan, input.nilai_kenalan);
    const { rows } = await this.pool.query<BarisLaporan>(
      `insert into report
         (jenis_kenalan, nilai_kenalan, nilai_hash, kategori_slug, penerangan,
          bukti_url, pelapor_emel, pdpa_persetujuan)
       values ($1, $2, $3, $4, $5, $6, $7, true)
       returning *`,
      [
        input.jenis_kenalan,
        nilai,
        hash,
        input.kategori_slug,
        input.penerangan,
        input.bukti,
        input.pelapor_emel,
      ],
    );
    return keLaporan(rows[0] as BarisLaporan);
  }

  async dapatkan(id: string): Promise<Laporan | undefined> {
    if (!/^[0-9a-f-]{36}$/i.test(id)) return undefined;
    const { rows } = await this.pool.query<BarisLaporan>('select * from report where id = $1', [id]);
    return rows[0] ? keLaporan(rows[0]) : undefined;
  }

  async senarai(pilihan: PilihanSenarai = {}): Promise<Laporan[]> {
    const syarat: string[] = [];
    const params: unknown[] = [];
    if (pilihan.giliran) {
      syarat.push("status = 'belum_disemak' and ditolak_pada is null and dibuang_pada is null");
    }
    if (pilihan.status?.length) {
      params.push(pilihan.status);
      syarat.push(`status = any($${params.length})`);
    }
    params.push(pilihan.had ?? 200);
    const { rows } = await this.pool.query<BarisLaporan>(
      `select * from report
        ${syarat.length ? `where ${syarat.join(' and ')}` : ''}
        order by tarikh_hantar desc
        limit $${params.length}`,
      params,
    );
    return rows.map(keLaporan);
  }

  async julatIkutAwalan(awalan: string): Promise<PadananJulat[]> {
    if (!awalanSah(awalan)) return [];
    const { rows } = await this.pool.query<{
      id: string;
      nilai_hash: string;
      status: ReportStatus;
      bilangan_sokongan: number;
      kategori_slug: string | null;
      tarikh_hantar: Date;
    }>(
      `select id, nilai_hash, status, bilangan_sokongan, kategori_slug, tarikh_hantar
         from report
        where left(nilai_hash, 5) = $1 and ${SYARAT_TERSIAR}`,
      [awalan],
    );
    return rows.map((r) => ({
      hash_suffix: akhiranHash(r.nilai_hash),
      laporan_id: r.id,
      status: r.status,
      bilangan_sokongan: Number(r.bilangan_sokongan),
      kategori_slug: r.kategori_slug,
      tarikh_hantar: r.tarikh_hantar.toISOString(),
    }));
  }

  async sokong(input: SokonganInput): Promise<Laporan | undefined> {
    // Kiraan naik; status sengaja tidak disentuh.
    const { rows } = await this.pool.query<BarisLaporan>(
      `update report
          set bilangan_sokongan = bilangan_sokongan + 1,
              dikemaskini_pada = now()
        where id = $1 and ${SYARAT_TERSIAR}
        returning *`,
      [input.laporan_id],
    );
    return rows[0] ? keLaporan(rows[0]) : undefined;
  }

  async tindakanModerator(input: TindakanInput): Promise<Laporan | undefined> {
    const client = await this.pool.connect();
    try {
      await client.query('begin');

      const set: Record<string, string> = {
        terima: `status = 'dilaporkan_komuniti', ditolak_pada = null, dibuang_pada = null,
                 disemak_oleh = $2, disemak_pada = now()`,
        tolak: `status = 'belum_disemak', ditolak_pada = now(), disemak_oleh = $2, disemak_pada = now()`,
        tanda_dipertikai: `status = 'dipertikai', disemak_oleh = $2, disemak_pada = now()`,
        buang: `dibuang_pada = now(), disemak_oleh = $2, disemak_pada = now()`,
        buka_semula: `status = 'belum_disemak', ditolak_pada = null, dibuang_pada = null,
                      disemak_oleh = null, disemak_pada = null`,
      };

      const { rows } = await client.query<BarisLaporan>(
        `update report set ${set[input.tindakan]}, catatan_moderator = $3, dikemaskini_pada = now()
          where id = $1 returning *`,
        [input.laporan_id, input.moderator_id, input.sebab],
      );
      if (!rows[0]) {
        await client.query('rollback');
        return undefined;
      }

      await client.query(
        `insert into moderator_log (report_id, moderator_id, tindakan, sebab)
         values ($1, $2, $3, $4)`,
        [input.laporan_id, input.moderator_id, input.tindakan, input.sebab],
      );

      await client.query('commit');
      return keLaporan(rows[0]);
    } catch (ralat) {
      await client.query('rollback');
      throw ralat;
    } finally {
      client.release();
    }
  }

  async ciptaBantahan(input: BantahanInput): Promise<Bantahan | undefined> {
    const client = await this.pool.connect();
    try {
      await client.query('begin');
      const { rows: laporan } = await client.query(
        `select id from report where id = $1 and ${SYARAT_TERSIAR}`,
        [input.laporan_id],
      );
      if (!laporan[0]) {
        await client.query('rollback');
        return undefined;
      }

      const { rows } = await client.query<{
        id: string;
        report_id: string;
        pembantah_nama: string;
        pembantah_emel: string;
        hujah: string;
        diterima_pada: Date;
        diakui_pada: Date | null;
        keputusan: Bantahan['keputusan'];
        keputusan_pada: Date | null;
      }>(
        `insert into dispute (report_id, pembantah_nama, pembantah_emel, hujah)
         values ($1, $2, $3, $4) returning *`,
        [input.laporan_id, input.pembantah_nama, input.pembantah_emel, input.hujah],
      );

      await client.query(
        `update report set status = 'dipertikai', dikemaskini_pada = now() where id = $1`,
        [input.laporan_id],
      );
      await client.query('commit');

      const b = rows[0];
      if (!b) return undefined;
      return {
        id: b.id,
        laporan_id: b.report_id,
        pembantah_nama: b.pembantah_nama,
        pembantah_emel: b.pembantah_emel,
        hujah: b.hujah,
        diterima_pada: b.diterima_pada.toISOString(),
        diakui_pada: iso(b.diakui_pada),
        keputusan: b.keputusan,
        keputusan_pada: iso(b.keputusan_pada),
      };
    } catch (ralat) {
      await client.query('rollback');
      throw ralat;
    } finally {
      client.release();
    }
  }

  async bantahanUntuk(laporanId: string): Promise<Bantahan[]> {
    const { rows } = await this.pool.query<{
      id: string;
      report_id: string;
      pembantah_nama: string;
      pembantah_emel: string;
      hujah: string;
      diterima_pada: Date;
      diakui_pada: Date | null;
      keputusan: Bantahan['keputusan'];
      keputusan_pada: Date | null;
    }>('select * from dispute where report_id = $1 order by diterima_pada desc', [laporanId]);

    return rows.map((b) => ({
      id: b.id,
      laporan_id: b.report_id,
      pembantah_nama: b.pembantah_nama,
      pembantah_emel: b.pembantah_emel,
      hujah: b.hujah,
      diterima_pada: b.diterima_pada.toISOString(),
      diakui_pada: iso(b.diakui_pada),
      keputusan: b.keputusan,
      keputusan_pada: iso(b.keputusan_pada),
    }));
  }

  async logModerator(had = 100): Promise<LogModerator[]> {
    const { rows } = await this.pool.query<{
      id: string;
      report_id: string | null;
      dispute_id: string | null;
      moderator_id: string;
      tindakan: LogModerator['tindakan'];
      sebab: string | null;
      tarikh: Date;
    }>('select * from moderator_log order by tarikh desc limit $1', [had]);

    return rows.map((r) => ({
      id: r.id,
      laporan_id: r.report_id,
      bantahan_id: r.dispute_id,
      moderator_id: r.moderator_id,
      tindakan: r.tindakan,
      sebab: r.sebab,
      tarikh: r.tarikh.toISOString(),
    }));
  }

  // ---- Digest e-mel ----

  async langgan(emel: string): Promise<Langganan> {
    const alamat = normalkanEmel(emel);
    const { rows } = await this.pool.query<{
      id: string;
      emel: string;
      disahkan_pada: Date | null;
      token_sah: string;
      token_batal: string;
      pdpa_persetujuan: boolean;
      created_at: Date;
    }>(
      `insert into digest_subscriber (emel, pdpa_persetujuan)
       values ($1, true)
       on conflict (emel) do update
         set token_sah = case
               when digest_subscriber.disahkan_pada is null then gen_random_uuid()
               else digest_subscriber.token_sah
             end
       returning *`,
      [alamat],
    );
    const baris = rows[0] as NonNullable<(typeof rows)[number]>;
    return {
      id: baris.id,
      emel: baris.emel,
      disahkan_pada: iso(baris.disahkan_pada),
      token_sah: baris.token_sah,
      token_batal: baris.token_batal,
      pdpa_persetujuan: baris.pdpa_persetujuan,
      created_at: baris.created_at.toISOString(),
    };
  }

  async sahkanLangganan(token: string): Promise<boolean> {
    if (!tokenSah(token)) return false;
    const { rowCount } = await this.pool.query(
      `update digest_subscriber
          set disahkan_pada = coalesce(disahkan_pada, now())
        where token_sah = $1`,
      [token],
    );
    return (rowCount ?? 0) > 0;
  }

  async berhentiLangganan(token: string): Promise<boolean> {
    if (!tokenSah(token)) return false;
    const { rowCount } = await this.pool.query('delete from digest_subscriber where token_batal = $1', [token]);
    return (rowCount ?? 0) > 0;
  }

  async bilanganLangganan(): Promise<number> {
    const { rows } = await this.pool.query<{ kiraan: string }>(
      'select count(*)::text as kiraan from digest_subscriber where disahkan_pada is not null',
    );
    return Number(rows[0]?.kiraan ?? 0);
  }
}
