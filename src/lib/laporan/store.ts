import type {
  Bantahan,
  BantahanInput,
  Laporan,
  LaporanInput,
  LogModerator,
  PadananJulat,
  SokonganInput,
  TindakanModerator,
} from './types';
import type { ReportStatus } from '@/lib/status';
import type { Langganan } from '@/lib/digest';

export type PilihanSenarai = {
  status?: ReportStatus[];
  /** true = hanya yang masih dalam giliran moderasi. */
  giliran?: boolean;
  had?: number;
};

export type TindakanInput = {
  laporan_id: string;
  tindakan: TindakanModerator;
  moderator_id: string;
  sebab: string | null;
};

/**
 * Antara muka storan laporan komuniti.
 *
 * Dua pelaksanaan disediakan:
 *  - `FileStore`  — JSON pada cakera. Lalai untuk pembangunan tempatan.
 *  - `PgStore`    — Postgres/Supabase mengikut `db/schema.sql`, aktif apabila
 *                   `DATABASE_URL` ditetapkan.
 *
 * Kedua-duanya mesti mengekalkan peraturan yang sama:
 *  - laporan baharu sentiasa bermula pada status `belum_disemak`;
 *  - tiada laporan tersiar tanpa rekod moderator (siapa & bila);
 *  - bilangan sokongan tidak pernah menaik taraf status.
 */
/**
 * Storan langganan digest e-mel.
 *
 * `langgan` mesti idempoten dan tidak boleh mendedahkan sama ada sesuatu alamat
 * sudah wujud — lihat `src/lib/digest.ts`.
 */
export interface DigestStore {
  langgan(emel: string): Promise<Langganan>;
  sahkanLangganan(token: string): Promise<boolean>;
  berhentiLangganan(token: string): Promise<boolean>;
  bilanganLangganan(): Promise<number>;
}

export interface LaporanStore {
  cipta(input: LaporanInput): Promise<Laporan>;
  dapatkan(id: string): Promise<Laporan | undefined>;
  senarai(pilihan?: PilihanSenarai): Promise<Laporan[]>;
  /** Carian k-anonymity: kembalikan semua padanan bagi 5 aksara awalan hash. */
  julatIkutAwalan(awalan: string): Promise<PadananJulat[]>;
  sokong(input: SokonganInput): Promise<Laporan | undefined>;
  tindakanModerator(input: TindakanInput): Promise<Laporan | undefined>;
  ciptaBantahan(input: BantahanInput): Promise<Bantahan | undefined>;
  bantahanUntuk(laporanId: string): Promise<Bantahan[]>;
  logModerator(had?: number): Promise<LogModerator[]>;
}

export type Store = LaporanStore & DigestStore;

let cached: Store | undefined;

/**
 * Pilih pelaksanaan storan.
 * Tetapkan `DATABASE_URL` untuk menggunakan Postgres; jika tidak, storan fail
 * digunakan supaya modul ini boleh dijalankan tanpa perkhidmatan luar.
 */
export async function getStore(): Promise<Store> {
  const sedia = cached;
  if (sedia) return sedia;

  let store: Store;
  if (process.env.DATABASE_URL) {
    const { PgStore } = await import('./pg-store');
    store = new PgStore(process.env.DATABASE_URL);
  } else {
    const { FileStore } = await import('./file-store');
    store = new FileStore();
  }
  cached = store;
  return store;
}

/** Untuk ujian: paksa storan tertentu. */
export function setStore(store: Store | undefined): void {
  cached = store;
}
