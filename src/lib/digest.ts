/**
 * Digest e-mel mingguan (opt-in).
 *
 * Prinsip:
 *  - Double opt-in: langganan hanya aktif selepas pengguna klik pautan
 *    pengesahan dalam e-mel. Ini menghalang orang lain melanggankan alamat anda.
 *  - Setiap langganan membawa token berhenti kekal, jadi berhenti tidak
 *    memerlukan log masuk.
 *  - Borang sentiasa memberi jawapan yang sama sama ada alamat itu sudah
 *    dilanggan atau belum — supaya ia tidak boleh digunakan untuk menguji
 *    sama ada seseorang berada dalam senarai.
 */

export type Langganan = {
  id: string;
  emel: string;
  disahkan_pada: string | null;
  /** Token untuk mengesahkan langganan (double opt-in). */
  token_sah: string;
  /** Token kekal untuk berhenti melanggan. */
  token_batal: string;
  pdpa_persetujuan: boolean;
  created_at: string;
};

const EMEL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function emelSah(nilai: string): boolean {
  return EMEL.test(nilai.trim()) && nilai.trim().length <= 254;
}

export function normalkanEmel(nilai: string): string {
  return nilai.trim().toLowerCase();
}

export function tokenSah(nilai: string): boolean {
  return /^[0-9a-f-]{36}$/i.test(nilai);
}
