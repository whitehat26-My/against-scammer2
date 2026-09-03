import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import net from 'node:net';
import {
  failDisulitkan,
  indeksButa,
  lupakanKunci,
  nyahsulit,
  nyahsulitBait,
  sidikJariPeranti,
  sudahDisulitkan,
  sulitkan,
  sulitkanBait,
} from '@/lib/kripto';
import { janaTotp, nyahkodBase32, sahkanTotp } from '@/lib/totp';
import { MASA_MINIMUM_MS, captchaWajib, perangkapDilanggar } from '@/lib/captcha';
import { imbasDenganClamd, imbasanMembenarkan } from '@/lib/imbasan';
import {
  HARI,
  HARI_SIMPAN_DIBUANG,
  HARI_SIMPAN_DITOLAK,
  patutDilucutDataPeribadi,
  patutDipadamSepenuhnya,
} from '@/lib/laporan/pembersihan';
import type { Laporan } from '@/lib/laporan/types';

const KUNCI = 'a'.repeat(64);

beforeEach(() => {
  vi.stubEnv('DATA_ENCRYPTION_KEY', KUNCI);
  lupakanKunci();
});

afterEach(() => {
  vi.unstubAllEnvs();
  lupakanKunci();
});

describe('enkripsi data peribadi semasa simpan', () => {
  it('menyulitkan dan menyahsulit teks', () => {
    const teks = 'pelapor@contoh.my';
    const sulit = sulitkan(teks);
    expect(sulit).not.toContain(teks);
    expect(sudahDisulitkan(sulit)).toBe(true);
    expect(nyahsulit(sulit)).toBe(teks);
  });

  it('menghasilkan ciphertext berbeza setiap kali', () => {
    expect(sulitkan('sama@contoh.my')).not.toBe(sulitkan('sama@contoh.my'));
  });

  it('menolak ciphertext yang diubah suai', () => {
    const sulit = sulitkan('pelapor@contoh.my');
    const rosak = `${sulit.slice(0, -6)}AAAAAA`;
    expect(() => nyahsulit(rosak)).toThrow();
  });

  it('tidak boleh dinyahsulit dengan kunci lain', () => {
    const sulit = sulitkan('pelapor@contoh.my');
    vi.stubEnv('DATA_ENCRYPTION_KEY', 'b'.repeat(64));
    lupakanKunci();
    expect(() => nyahsulit(sulit)).toThrow();
  });

  it('membiarkan nilai yang belum disulitkan lalu tanpa perubahan', () => {
    expect(nyahsulit('teks-lama-tanpa-enkripsi')).toBe('teks-lama-tanpa-enkripsi');
  });

  it('menyulitkan fail bukti dan memulihkannya dengan tepat', () => {
    const asal = new Uint8Array([0xff, 0xd8, 0xff, 1, 2, 3, 4, 5]);
    const sulit = sulitkanBait(asal);
    expect(failDisulitkan(sulit)).toBe(true);
    // Bait ajaib JPEG tidak boleh kelihatan dalam fail yang disimpan.
    expect(sulit[0]).not.toBe(0xff);
    expect([...nyahsulitBait(sulit)]).toEqual([...asal]);
  });

  it('indeks buta deterministik tetapi tidak boleh dibalikkan', () => {
    const a = indeksButa('Orang@Contoh.MY');
    expect(a).toBe(indeksButa(' orang@contoh.my '));
    expect(a).not.toContain('orang');
    expect(a).not.toBe(indeksButa('lain@contoh.my'));
    expect(a).toMatch(/^[0-9a-f]{64}$/);
  });

  it('sidik jari peranti tidak mengandungi IP atau ejen pengguna mentah', () => {
    const sidik = sidikJariPeranti('Mozilla/5.0 Contoh', '203.0.113.9');
    expect(sidik).toMatch(/^[0-9a-f]{32}$/);
    expect(sidik).not.toContain('203.0.113.9');
  });
});

describe('TOTP', () => {
  // Vektor rujukan RFC 6238: rahsia ASCII "12345678901234567890".
  const RAHSIA = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ';

  it('menyahkod base32 dengan betul', () => {
    expect(nyahkodBase32(RAHSIA).toString('utf8')).toBe('12345678901234567890');
  });

  it('sepadan dengan vektor rujukan RFC 6238', () => {
    expect(janaTotp(RAHSIA, 59_000)).toBe('287082');
    expect(janaTotp(RAHSIA, 1_111_111_109_000)).toBe('081804');
  });

  it('menerima kod semasa dan menolak kod salah', () => {
    const sekarang = 1_700_000_000_000;
    expect(sahkanTotp(RAHSIA, janaTotp(RAHSIA, sekarang), sekarang)).toBe(true);
    expect(sahkanTotp(RAHSIA, '000000', sekarang)).toBe(false);
    expect(sahkanTotp(RAHSIA, 'abcdef', sekarang)).toBe(false);
    expect(sahkanTotp(RAHSIA, '12345', sekarang)).toBe(false);
  });

  it('bertoleransi dengan jam yang terpesong satu langkah', () => {
    const sekarang = 1_700_000_000_000;
    expect(sahkanTotp(RAHSIA, janaTotp(RAHSIA, sekarang - 30_000), sekarang)).toBe(true);
    expect(sahkanTotp(RAHSIA, janaTotp(RAHSIA, sekarang + 30_000), sekarang)).toBe(true);
    // Dua langkah adalah terlalu jauh.
    expect(sahkanTotp(RAHSIA, janaTotp(RAHSIA, sekarang - 90_000), sekarang)).toBe(false);
  });
});

describe('perangkap bot', () => {
  it('menolak apabila medan umpan diisi', () => {
    expect(perangkapDilanggar('apa-apa', Date.now() - 10_000)).toBe(true);
  });

  it('menolak penghantaran yang terlalu pantas', () => {
    const sekarang = 1_700_000_000_000;
    expect(perangkapDilanggar('', sekarang - 500, sekarang)).toBe(true);
    expect(perangkapDilanggar('', sekarang - MASA_MINIMUM_MS - 1, sekarang)).toBe(false);
  });

  it('menolak cap masa yang hilang atau tidak masuk akal', () => {
    expect(perangkapDilanggar('', 0)).toBe(true);
    expect(perangkapDilanggar('', Number.NaN)).toBe(true);
  });

  it('CAPTCHA wajib dalam produksi', () => {
    vi.stubEnv('NODE_ENV', 'production');
    expect(captchaWajib()).toBe(true);
    vi.stubEnv('NODE_ENV', 'development');
    expect(captchaWajib()).toBe(false);
  });
});

describe('imbasan malware (protokol clamd INSTREAM)', () => {
  async function pelayanTiruan(balasan: string | null): Promise<{ port: number; tutup: () => void }> {
    const pelayan = net.createServer((soket) => {
      soket.on('data', () => {
        if (balasan === null) soket.destroy();
        else soket.write(`${balasan}\0`);
      });
    });
    await new Promise<void>((r) => pelayan.listen(0, '127.0.0.1', r));
    const alamat = pelayan.address();
    const port = typeof alamat === 'object' && alamat ? alamat.port : 0;
    return { port, tutup: () => pelayan.close() };
  }

  it('mengenal pasti fail bersih', async () => {
    const { port, tutup } = await pelayanTiruan('stream: OK');
    expect(await imbasDenganClamd(new Uint8Array([1, 2, 3]), '127.0.0.1', port)).toBe('bersih');
    tutup();
  });

  it('mengenal pasti fail dijangkiti', async () => {
    const { port, tutup } = await pelayanTiruan('stream: Eicar-Test-Signature FOUND');
    expect(await imbasDenganClamd(new Uint8Array([1, 2, 3]), '127.0.0.1', port)).toBe('dijangkiti');
    tutup();
  });

  it('menganggap pengimbas yang tidak dapat dihubungi sebagai ralat', async () => {
    // Port 1 tidak mendengar dalam persekitaran ujian.
    expect(await imbasDenganClamd(new Uint8Array([1]), '127.0.0.1', 1, 1500)).toBe('ralat');
  });

  it('gagal-tutup: hanya bersih atau tiada pengimbas dibenarkan', () => {
    expect(imbasanMembenarkan('bersih')).toBe(true);
    expect(imbasanMembenarkan('tiada-pengimbas')).toBe(true);
    expect(imbasanMembenarkan('dijangkiti')).toBe(false);
    expect(imbasanMembenarkan('ralat')).toBe(false);
  });
});

describe('dasar simpanan data', () => {
  const asas: Laporan = {
    id: 'x',
    jenis_kenalan: 'telefon',
    nilai_kenalan: '+60123456789',
    nilai_hash: 'a'.repeat(64),
    kategori_slug: null,
    penerangan: 'contoh',
    bukti: ['fail.jpg'],
    status: 'dilaporkan_komuniti',
    bilangan_sokongan: 1,
    pelapor_emel: 'pelapor@contoh.my',
    pdpa_persetujuan: true,
    pdpa_persetujuan_pada: new Date().toISOString(),
    simpan_sehingga: '2030-01-01',
    disemak_oleh: 'aisyah',
    disemak_pada: new Date().toISOString(),
    catatan_moderator: null,
    ditolak_pada: null,
    dibuang_pada: null,
    tarikh_hantar: new Date().toISOString(),
    dikemaskini_pada: new Date().toISOString(),
  };
  const sekarang = Date.parse('2026-09-01T00:00:00Z');

  it('memadam laporan yang ditolak selepas tempoh simpannya', () => {
    const baharu = { ...asas, ditolak_pada: new Date(sekarang - 10 * HARI).toISOString() };
    const lama = { ...asas, ditolak_pada: new Date(sekarang - (HARI_SIMPAN_DITOLAK + 1) * HARI).toISOString() };
    expect(patutDipadamSepenuhnya(baharu, sekarang)).toBe(false);
    expect(patutDipadamSepenuhnya(lama, sekarang)).toBe(true);
  });

  it('memadam laporan yang dibuang selepas tempoh yang lebih pendek', () => {
    const lama = { ...asas, dibuang_pada: new Date(sekarang - (HARI_SIMPAN_DIBUANG + 1) * HARI).toISOString() };
    expect(patutDipadamSepenuhnya(lama, sekarang)).toBe(true);
  });

  it('melucutkan data peribadi laporan tersiar selepas tempoh simpan tamat', () => {
    expect(patutDilucutDataPeribadi(asas, sekarang)).toBe(false);
    const tamat = { ...asas, simpan_sehingga: '2026-01-01' };
    expect(patutDilucutDataPeribadi(tamat, sekarang)).toBe(true);
  });

  it('tidak melucutkan apa-apa jika tiada data peribadi tinggal', () => {
    const bersih = { ...asas, simpan_sehingga: '2026-01-01', pelapor_emel: null, bukti: [] };
    expect(patutDilucutDataPeribadi(bersih, sekarang)).toBe(false);
  });
});
