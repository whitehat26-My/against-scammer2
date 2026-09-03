import { afterEach, describe, expect, it } from 'vitest';
import { ipKlien, IP_TEMPATAN } from '../src/lib/ip';

const asal = process.env.DI_BELAKANG_CLOUDFLARE;
afterEach(() => {
  if (asal === undefined) delete process.env.DI_BELAKANG_CLOUDFLARE;
  else process.env.DI_BELAKANG_CLOUDFLARE = asal;
});

function h(rec: Record<string, string>): Headers {
  return new Headers(rec);
}

describe('ipKlien tanpa Cloudflare', () => {
  it('guna entri pertama X-Forwarded-For', () => {
    delete process.env.DI_BELAKANG_CLOUDFLARE;
    expect(ipKlien(h({ 'x-forwarded-for': '203.0.113.5, 10.0.0.1' }))).toBe('203.0.113.5');
  });
  it('jatuh balik ke X-Real-IP', () => {
    delete process.env.DI_BELAKANG_CLOUDFLARE;
    expect(ipKlien(h({ 'x-real-ip': '198.51.100.9' }))).toBe('198.51.100.9');
  });
  it('tempatan jika tiada pengepala', () => {
    delete process.env.DI_BELAKANG_CLOUDFLARE;
    expect(ipKlien(h({}))).toBe(IP_TEMPATAN);
  });
});

describe('ipKlien di belakang Cloudflare', () => {
  it('percaya CF-Connecting-IP sahaja', () => {
    process.env.DI_BELAKANG_CLOUDFLARE = '1';
    expect(ipKlien(h({ 'cf-connecting-ip': '203.0.113.7' }))).toBe('203.0.113.7');
  });
  it('abaikan X-Forwarded-For yang dipalsukan klien', () => {
    process.env.DI_BELAKANG_CLOUDFLARE = '1';
    // Penyerang menghantar XFF palsu untuk memintas senarai putih IP.
    // Tanpa CF-Connecting-IP, kita TIDAK boleh mempercayainya.
    expect(ipKlien(h({ 'x-forwarded-for': '10.0.0.1', 'x-real-ip': '10.0.0.1' }))).toBe(IP_TEMPATAN);
  });
  it('utamakan CF-Connecting-IP walaupun XFF hadir', () => {
    process.env.DI_BELAKANG_CLOUDFLARE = '1';
    expect(ipKlien(h({ 'cf-connecting-ip': '203.0.113.7', 'x-forwarded-for': '10.0.0.1' }))).toBe('203.0.113.7');
  });
});
