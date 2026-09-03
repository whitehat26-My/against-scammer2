import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  akaunTokenLemah,
  bacaToken,
  ciptaToken,
  menggunakanAkaunLalai,
  mfaLengkap,
  moderasiDikonfigurasi,
  sahkanKelayakan,
  sahkanTotpModerator,
  totpDiperlukan,
} from '@/lib/moderator';
import { janaTotp } from '@/lib/totp';
import { hadKadar, kosongkanHadKadar } from '@/lib/rate-limit';

const ENV_ASAL = { akaun: process.env.MODERATOR_AKAUN, rahsia: process.env.SESSION_SECRET };

beforeEach(() => {
  process.env.MODERATOR_AKAUN = 'aisyah:token-rahsia-satu,farid:token-rahsia-dua';
  process.env.SESSION_SECRET = 'rahsia-ujian-yang-cukup-panjang-123456';
  kosongkanHadKadar();
});

afterEach(() => {
  if (ENV_ASAL.akaun === undefined) delete process.env.MODERATOR_AKAUN;
  else process.env.MODERATOR_AKAUN = ENV_ASAL.akaun;
  if (ENV_ASAL.rahsia === undefined) delete process.env.SESSION_SECRET;
  else process.env.SESSION_SECRET = ENV_ASAL.rahsia;
});

describe('kelayakan moderator', () => {
  it('menerima hanya pasangan ID dan token yang betul', () => {
    expect(sahkanKelayakan('aisyah', 'token-rahsia-satu')).toBe(true);
    expect(sahkanKelayakan('farid', 'token-rahsia-dua')).toBe(true);
    expect(sahkanKelayakan('aisyah', 'token-rahsia-dua')).toBe(false);
    expect(sahkanKelayakan('orang-lain', 'token-rahsia-satu')).toBe(false);
    expect(sahkanKelayakan('aisyah', '')).toBe(false);
  });

  it('tiada akaun lalai dalam produksi', () => {
    vi.stubEnv('MODERATOR_AKAUN', '');
    vi.stubEnv('NODE_ENV', 'production');
    expect(moderasiDikonfigurasi()).toBe(false);
    expect(menggunakanAkaunLalai()).toBe(false);
    vi.unstubAllEnvs();
  });

  it('akaun demo hanya wujud di luar produksi', () => {
    vi.stubEnv('MODERATOR_AKAUN', '');
    vi.stubEnv('NODE_ENV', 'development');
    expect(menggunakanAkaunLalai()).toBe(true);
    expect(moderasiDikonfigurasi()).toBe(true);
    vi.unstubAllEnvs();
  });
});

describe('pengesahan dua faktor moderator', () => {
  const RAHSIA = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ';

  it('TOTP diperlukan hanya untuk akaun yang mempunyai rahsia', () => {
    vi.stubEnv('MODERATOR_TOTP', `aisyah:${RAHSIA}`);
    expect(totpDiperlukan('aisyah')).toBe(true);
    expect(totpDiperlukan('farid')).toBe(false);
    vi.unstubAllEnvs();
  });

  it('menerima kod semasa dan menolak kod salah', () => {
    vi.stubEnv('MODERATOR_TOTP', `aisyah:${RAHSIA}`);
    expect(sahkanTotpModerator('aisyah', janaTotp(RAHSIA))).toBe(true);
    expect(sahkanTotpModerator('aisyah', '000000')).toBe(false);
    vi.unstubAllEnvs();
  });

  it('melaporkan apabila sebahagian akaun tiada MFA', () => {
    vi.stubEnv('MODERATOR_TOTP', `aisyah:${RAHSIA}`);
    expect(mfaLengkap()).toBe(false);
    vi.stubEnv('MODERATOR_TOTP', `aisyah:${RAHSIA},farid:${RAHSIA}`);
    expect(mfaLengkap()).toBe(true);
    vi.unstubAllEnvs();
  });

  it('mengesan token yang terlalu pendek', () => {
    vi.stubEnv('MODERATOR_AKAUN', 'aisyah:pendek,farid:token-yang-cukup-panjang-untuk-selamat');
    expect(akaunTokenLemah()).toEqual(['aisyah']);
    vi.unstubAllEnvs();
  });
});

describe('token sesi', () => {
  it('membaca semula moderator daripada token yang sah', () => {
    const token = ciptaToken('aisyah');
    expect(bacaToken(token)?.id).toBe('aisyah');
  });

  it('menolak token yang diubah suai', () => {
    const token = ciptaToken('aisyah');
    const [id, luput, tanda] = token.split('.');
    expect(bacaToken(`farid.${luput}.${tanda}`)).toBeUndefined();
    expect(bacaToken(`${id}.${luput}.${'0'.repeat(64)}`)).toBeUndefined();
    expect(bacaToken('bukan-token')).toBeUndefined();
    expect(bacaToken(undefined)).toBeUndefined();
  });

  it('menolak token yang telah luput', () => {
    const muatan = `aisyah.${Math.floor(Date.now() / 1000) - 10}`;
    const token = ciptaToken('aisyah');
    const tanda = token.split('.')[2];
    expect(bacaToken(`${muatan}.${tanda}`)).toBeUndefined();
  });

  it('token tidak boleh dibaca dengan rahsia yang berbeza', () => {
    const token = ciptaToken('aisyah');
    process.env.SESSION_SECRET = 'rahsia-lain-yang-juga-cukup-panjang';
    expect(bacaToken(token)).toBeUndefined();
  });
});

describe('had kadar', () => {
  it('membenarkan sehingga had, kemudian menyekat', () => {
    for (let i = 0; i < 3; i += 1) {
      expect(hadKadar('ujian', 3, 60).dibenarkan).toBe(true);
    }
    const disekat = hadKadar('ujian', 3, 60);
    expect(disekat.dibenarkan).toBe(false);
    expect(disekat.bakiSaat).toBeGreaterThan(0);
  });

  it('mengasingkan kiraan antara pengenal', () => {
    expect(hadKadar('a', 1, 60).dibenarkan).toBe(true);
    expect(hadKadar('a', 1, 60).dibenarkan).toBe(false);
    expect(hadKadar('b', 1, 60).dibenarkan).toBe(true);
  });
});
