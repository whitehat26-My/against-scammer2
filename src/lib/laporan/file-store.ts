import fs from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import type { DigestStore, LaporanStore, PilihanSenarai, TindakanInput } from './store';
import {
  bolehTersiar,
  dalamGiliran,
  type Bantahan,
  type BantahanInput,
  type Laporan,
  type LaporanInput,
  type LogModerator,
  type PadananJulat,
  type SokonganInput,
} from './types';
import { akhiranHash, awalanHash, awalanSah, hashNilai, normalkanNilai } from './nilai';
import { normalkanEmel, tokenSah, type Langganan } from '@/lib/digest';

type Data = {
  laporan: Laporan[];
  bantahan: Bantahan[];
  log: LogModerator[];
  digest: Langganan[];
};

const KOSONG: Data = { laporan: [], bantahan: [], log: [], digest: [] };

export function dataDir(): string {
  return process.env.DATA_DIR ?? path.join(process.cwd(), '.data');
}

/**
 * Storan berasaskan fail JSON.
 *
 * Sesuai untuk pembangunan tempatan dan demo. Untuk produksi gunakan
 * `PgStore` dengan Postgres/Supabase — lihat `db/schema.sql`.
 */
export class FileStore implements LaporanStore, DigestStore {
  private readonly fail = path.join(dataDir(), 'laporan.json');
  /** Rantaian janji ringkas supaya tulisan serentak tidak merosakkan fail. */
  private giliranTulis: Promise<unknown> = Promise.resolve();

  private async baca(): Promise<Data> {
    try {
      const teks = await fs.readFile(this.fail, 'utf8');
      const data = JSON.parse(teks) as Partial<Data>;
      return {
        laporan: data.laporan ?? [],
        bantahan: data.bantahan ?? [],
        log: data.log ?? [],
        digest: data.digest ?? [],
      };
    } catch {
      return structuredClone(KOSONG);
    }
  }

  private async tulis(data: Data): Promise<void> {
    await fs.mkdir(dataDir(), { recursive: true });
    const sementara = `${this.fail}.${randomUUID()}.tmp`;
    await fs.writeFile(sementara, JSON.stringify(data, null, 2), 'utf8');
    await fs.rename(sementara, this.fail);
  }

  /** Jalankan operasi baca-ubah-tulis secara bersiri. */
  private kemas<T>(fn: (data: Data) => Promise<T> | T): Promise<T> {
    const seterusnya = this.giliranTulis.then(async () => {
      const data = await this.baca();
      const hasil = await fn(data);
      await this.tulis(data);
      return hasil;
    });
    this.giliranTulis = seterusnya.catch(() => undefined);
    return seterusnya;
  }

  async cipta(input: LaporanInput): Promise<Laporan> {
    const sekarang = new Date().toISOString();
    const nilai = normalkanNilai(input.jenis_kenalan, input.nilai_kenalan);
    const hash = await hashNilai(input.jenis_kenalan, input.nilai_kenalan);
    const simpanSehingga = new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 2).toISOString().slice(0, 10);

    return this.kemas((data) => {
      const laporan: Laporan = {
        id: randomUUID(),
        jenis_kenalan: input.jenis_kenalan,
        nilai_kenalan: nilai,
        nilai_hash: hash,
        kategori_slug: input.kategori_slug,
        penerangan: input.penerangan,
        bukti: input.bukti,
        // Moderation-first: tiada laporan bermula dalam keadaan tersiar.
        status: 'belum_disemak',
        bilangan_sokongan: 1,
        pelapor_emel: input.pelapor_emel,
        pdpa_persetujuan: true,
        pdpa_persetujuan_pada: sekarang,
        simpan_sehingga: simpanSehingga,
        disemak_oleh: null,
        disemak_pada: null,
        catatan_moderator: null,
        ditolak_pada: null,
        dibuang_pada: null,
        tarikh_hantar: sekarang,
        dikemaskini_pada: sekarang,
      };
      data.laporan.push(laporan);
      return laporan;
    });
  }

  async dapatkan(id: string): Promise<Laporan | undefined> {
    const data = await this.baca();
    return data.laporan.find((l) => l.id === id);
  }

  async senarai(pilihan: PilihanSenarai = {}): Promise<Laporan[]> {
    const data = await this.baca();
    let hasil = [...data.laporan].sort((a, b) => b.tarikh_hantar.localeCompare(a.tarikh_hantar));
    if (pilihan.giliran) hasil = hasil.filter(dalamGiliran);
    if (pilihan.status) hasil = hasil.filter((l) => pilihan.status?.includes(l.status));
    return pilihan.had ? hasil.slice(0, pilihan.had) : hasil;
  }

  async julatIkutAwalan(awalan: string): Promise<PadananJulat[]> {
    if (!awalanSah(awalan)) return [];
    const data = await this.baca();
    return data.laporan
      .filter((l) => bolehTersiar(l) && awalanHash(l.nilai_hash) === awalan)
      .map((l) => ({
        hash_suffix: akhiranHash(l.nilai_hash),
        laporan_id: l.id,
        status: l.status,
        bilangan_sokongan: l.bilangan_sokongan,
        kategori_slug: l.kategori_slug,
        tarikh_hantar: l.tarikh_hantar,
      }));
  }

  async sokong(input: SokonganInput): Promise<Laporan | undefined> {
    return this.kemas((data) => {
      const laporan = data.laporan.find((l) => l.id === input.laporan_id);
      if (!laporan || !bolehTersiar(laporan)) return undefined;
      // Kiraan naik, status TIDAK berubah.
      laporan.bilangan_sokongan += 1;
      laporan.dikemaskini_pada = new Date().toISOString();
      return laporan;
    });
  }

  async tindakanModerator(input: TindakanInput): Promise<Laporan | undefined> {
    return this.kemas((data) => {
      const laporan = data.laporan.find((l) => l.id === input.laporan_id);
      if (!laporan) return undefined;
      const sekarang = new Date().toISOString();

      switch (input.tindakan) {
        case 'terima':
          laporan.status = 'dilaporkan_komuniti';
          laporan.ditolak_pada = null;
          laporan.dibuang_pada = null;
          break;
        case 'tolak':
          laporan.status = 'belum_disemak';
          laporan.ditolak_pada = sekarang;
          break;
        case 'tanda_dipertikai':
          laporan.status = 'dipertikai';
          break;
        case 'buang':
          laporan.dibuang_pada = sekarang;
          break;
        case 'buka_semula':
          laporan.status = 'belum_disemak';
          laporan.ditolak_pada = null;
          laporan.dibuang_pada = null;
          laporan.disemak_oleh = null;
          laporan.disemak_pada = null;
          break;
      }

      if (input.tindakan !== 'buka_semula') {
        laporan.disemak_oleh = input.moderator_id;
        laporan.disemak_pada = sekarang;
      }
      laporan.catatan_moderator = input.sebab;
      laporan.dikemaskini_pada = sekarang;

      data.log.unshift({
        id: randomUUID(),
        laporan_id: laporan.id,
        bantahan_id: null,
        moderator_id: input.moderator_id,
        tindakan: input.tindakan,
        sebab: input.sebab,
        tarikh: sekarang,
      });

      return laporan;
    });
  }

  async ciptaBantahan(input: BantahanInput): Promise<Bantahan | undefined> {
    return this.kemas((data) => {
      const laporan = data.laporan.find((l) => l.id === input.laporan_id);
      if (!laporan || !bolehTersiar(laporan)) return undefined;
      const sekarang = new Date().toISOString();

      const bantahan: Bantahan = {
        id: randomUUID(),
        laporan_id: input.laporan_id,
        pembantah_nama: input.pembantah_nama,
        pembantah_emel: input.pembantah_emel,
        hujah: input.hujah,
        diterima_pada: sekarang,
        diakui_pada: null,
        keputusan: null,
        keputusan_pada: null,
      };
      data.bantahan.push(bantahan);

      // Laporan ditanda "dipertikai" serta-merta semasa semakan dijalankan.
      laporan.status = 'dipertikai';
      laporan.dikemaskini_pada = sekarang;
      return bantahan;
    });
  }

  async bantahanUntuk(laporanId: string): Promise<Bantahan[]> {
    const data = await this.baca();
    return data.bantahan.filter((b) => b.laporan_id === laporanId);
  }

  async logModerator(had = 100): Promise<LogModerator[]> {
    const data = await this.baca();
    return data.log.slice(0, had);
  }

  // ---- Digest e-mel ----

  async langgan(emel: string): Promise<Langganan> {
    const alamat = normalkanEmel(emel);
    return this.kemas((data) => {
      const sedia = data.digest.find((l) => l.emel === alamat);
      if (sedia) {
        // Belum disahkan: jana token baharu supaya pautan lama tidak kekal sah.
        if (!sedia.disahkan_pada) sedia.token_sah = randomUUID();
        return sedia;
      }
      const baharu: Langganan = {
        id: randomUUID(),
        emel: alamat,
        disahkan_pada: null,
        token_sah: randomUUID(),
        token_batal: randomUUID(),
        pdpa_persetujuan: true,
        created_at: new Date().toISOString(),
      };
      data.digest.push(baharu);
      return baharu;
    });
  }

  async sahkanLangganan(token: string): Promise<boolean> {
    if (!tokenSah(token)) return false;
    return this.kemas((data) => {
      const langganan = data.digest.find((l) => l.token_sah === token);
      if (!langganan) return false;
      langganan.disahkan_pada ??= new Date().toISOString();
      return true;
    });
  }

  async berhentiLangganan(token: string): Promise<boolean> {
    if (!tokenSah(token)) return false;
    return this.kemas((data) => {
      const index = data.digest.findIndex((l) => l.token_batal === token);
      if (index === -1) return false;
      // Berhenti bermakna data dibuang, bukan sekadar ditanda.
      data.digest.splice(index, 1);
      return true;
    });
  }

  async bilanganLangganan(): Promise<number> {
    const data = await this.baca();
    return data.digest.filter((l) => l.disahkan_pada !== null).length;
  }
}
