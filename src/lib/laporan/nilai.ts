/**
 * Normalisasi & hashing nilai yang dilaporkan.
 *
 * Hash digunakan untuk carian secara k-anonymity: pelayar menghantar hanya
 * 5 aksara pertama hash, jadi pelayan tidak pernah tahu apa yang dicari.
 * Lihat `src/app/api/laporan/julat/route.ts`.
 *
 * Fail ini mesti kekal tulen (tiada `node:*`) kerana ia dikongsi antara
 * pelayan dan pelayar.
 */

import type { JenisKenalan } from './types';

export const PANJANG_AWALAN = 5;

/** Normalisasi supaya "012-345 6789" dan "+60123456789" menghasilkan hash sama. */
export function normalkanNilai(jenis: JenisKenalan, nilai: string): string {
  const bersih = nilai.trim().replace(/\s+/g, ' ');
  switch (jenis) {
    case 'telefon': {
      const digit = bersih.replace(/[^\d]/g, '');
      if (digit.startsWith('60')) return `+${digit}`;
      if (digit.startsWith('0')) return `+60${digit.slice(1)}`;
      return `+${digit}`;
    }
    case 'akaun_bank':
      return bersih.replace(/[^\d]/g, '');
    case 'url': {
      const tanpaSkema = bersih.replace(/^https?:\/\//i, '').replace(/^www\./i, '');
      const hos = tanpaSkema.split(/[/?#]/)[0] ?? tanpaSkema;
      return hos.toLowerCase();
    }
    default:
      return bersih.toLowerCase();
  }
}

function keHex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** SHA-256 bagi nilai yang telah dinormalkan. Berfungsi di pelayan dan pelayar. */
export async function hashNilai(jenis: JenisKenalan, nilai: string): Promise<string> {
  const normal = normalkanNilai(jenis, nilai);
  const data = new TextEncoder().encode(`${jenis}:${normal}`);
  return keHex(await crypto.subtle.digest('SHA-256', data));
}

export function awalanHash(hash: string): string {
  return hash.slice(0, PANJANG_AWALAN);
}

export function akhiranHash(hash: string): string {
  return hash.slice(PANJANG_AWALAN);
}

export function awalanSah(awalan: string): boolean {
  return new RegExp(`^[0-9a-f]{${PANJANG_AWALAN}}$`).test(awalan);
}
