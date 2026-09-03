import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * TOTP (RFC 6238) untuk pengesahan dua faktor akaun moderator.
 *
 * Menyokong aplikasi authenticator standard (Google Authenticator, Aegis,
 * 1Password, dan sebagainya). SMS sengaja tidak disokong — ia terdedah kepada
 * SIM swap, iaitu serangan yang sama jenis dengan apa yang portal ini amarkan.
 */

const LANGKAH_SAAT = 30;
const DIGIT = 6;
/** Terima kod dari satu langkah sebelum dan selepas, untuk jam yang terpesong. */
const TOLERANSI = 1;

export function nyahkodBase32(input: string): Buffer {
  const abjad = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const bersih = input.replace(/=+$/, '').replace(/\s+/g, '').toUpperCase();

  let bit = 0;
  let nilai = 0;
  const keluar: number[] = [];

  for (const aksara of bersih) {
    const index = abjad.indexOf(aksara);
    if (index === -1) throw new Error('Rahsia TOTP bukan base32 yang sah.');
    nilai = (nilai << 5) | index;
    bit += 5;
    if (bit >= 8) {
      keluar.push((nilai >>> (bit - 8)) & 0xff);
      bit -= 8;
    }
  }

  return Buffer.from(keluar);
}

function kodUntukKaunter(rahsia: Buffer, kaunter: number): string {
  const buf = Buffer.alloc(8);
  buf.writeBigUInt64BE(BigInt(kaunter));
  const hmac = createHmac('sha1', rahsia).update(buf).digest();

  const offset = (hmac[hmac.length - 1] as number) & 0x0f;
  const binari =
    (((hmac[offset] as number) & 0x7f) << 24) |
    (((hmac[offset + 1] as number) & 0xff) << 16) |
    (((hmac[offset + 2] as number) & 0xff) << 8) |
    ((hmac[offset + 3] as number) & 0xff);

  return String(binari % 10 ** DIGIT).padStart(DIGIT, '0');
}

export function janaTotp(rahsiaBase32: string, masaMs = Date.now()): string {
  const kaunter = Math.floor(masaMs / 1000 / LANGKAH_SAAT);
  return kodUntukKaunter(nyahkodBase32(rahsiaBase32), kaunter);
}

/** Sahkan kod TOTP. Perbandingan masa tetap; toleransi ±1 langkah. */
export function sahkanTotp(rahsiaBase32: string, kod: string, masaMs = Date.now()): boolean {
  const bersih = kod.replace(/\s+/g, '');
  if (!/^\d{6}$/.test(bersih)) return false;

  const rahsia = nyahkodBase32(rahsiaBase32);
  const kaunter = Math.floor(masaMs / 1000 / LANGKAH_SAAT);
  const diberi = Buffer.from(bersih);

  for (let d = -TOLERANSI; d <= TOLERANSI; d += 1) {
    const jangkaan = Buffer.from(kodUntukKaunter(rahsia, kaunter + d));
    if (jangkaan.length === diberi.length && timingSafeEqual(jangkaan, diberi)) return true;
  }
  return false;
}
