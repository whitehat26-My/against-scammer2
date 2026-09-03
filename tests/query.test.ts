import { describe, expect, it } from 'vitest';
import {
  analyseUrl,
  classifyQuery,
  extractHost,
  isMalaysianPhone,
  looksLikeBankAccount,
  looksLikeUrl,
  normalizePhone,
  registrableDomain,
} from '@/lib/query';

describe('pengesanan nombor telefon', () => {
  it('mengenali format mudah alih Malaysia', () => {
    for (const input of ['0123456789', '012-345 6789', '+60123456789', '60 12 345 6789', '011-1234 5678']) {
      expect(isMalaysianPhone(input), input).toBe(true);
    }
  });

  it('mengenali talian tetap', () => {
    for (const input of ['03-1234 5678', '082-123456', '04-1234567']) {
      expect(isMalaysianPhone(input), input).toBe(true);
    }
  });

  it('menolak input yang bukan nombor telefon', () => {
    for (const input of ['1234', 'Syarikat ABC Sdn Bhd', 'contoh.com', '00000']) {
      expect(isMalaysianPhone(input), input).toBe(false);
    }
  });

  it('menormalkan kepada format antarabangsa', () => {
    expect(normalizePhone('012-345 6789')).toBe('+60123456789');
    expect(normalizePhone('+60123456789')).toBe('+60123456789');
    expect(normalizePhone('60123456789')).toBe('+60123456789');
  });
});

describe('pengesanan nombor akaun bank', () => {
  it('menerima 8 hingga 20 digit', () => {
    expect(looksLikeBankAccount('12345678')).toBe(true);
    expect(looksLikeBankAccount('1234 5678 9012')).toBe(true);
    expect(looksLikeBankAccount('1234567')).toBe(false);
    expect(looksLikeBankAccount('123456789012345678901')).toBe(false);
  });
});

describe('pengesanan URL', () => {
  it('mengenali alamat dengan dan tanpa skema', () => {
    expect(looksLikeUrl('https://semakmule.rmp.gov.my')).toBe(true);
    expect(looksLikeUrl('contoh-tipu.xyz')).toBe(true);
    expect(looksLikeUrl('www.pos.com.my/track')).toBe(true);
    expect(looksLikeUrl('Syarikat Maju Sdn Bhd')).toBe(false);
  });

  it('mengeluarkan hos tanpa www', () => {
    expect(extractHost('https://www.contoh.com/laluan?a=1')).toBe('contoh.com');
  });

  it('mengira domain berdaftar termasuk akhiran dua peringkat', () => {
    expect(registrableDomain('semakmule.rmp.gov.my')).toBe('rmp.gov.my');
    expect(registrableDomain('a.b.contoh.com')).toBe('contoh.com');
    expect(registrableDomain('contoh.com')).toBe('contoh.com');
  });
});

describe('petunjuk heuristik URL', () => {
  it('menandakan domain kerajaan palsu', () => {
    expect(analyseUrl('https://jpj-saman-gov.xyz').hints).toContain('tiru_gov');
  });

  it('menandakan nama jenama pada domain bukan rasmi', () => {
    expect(analyseUrl('https://maybank2u-secure-login.top').hints).toContain('tiru_jenama');
  });

  it('tidak menandakan domain rasmi jenama', () => {
    expect(analyseUrl('https://www.maybank2u.com.my/login').hints).not.toContain('tiru_jenama');
  });

  it('menandakan pemendek URL, http dan alamat IP', () => {
    expect(analyseUrl('https://bit.ly/abc').hints).toContain('pemendek_url');
    expect(analyseUrl('http://contoh.com').hints).toContain('bukan_https');
    expect(analyseUrl('http://192.168.1.1/login').hints).toContain('alamat_ip');
  });

  it('tidak menandakan laman rasmi kerajaan', () => {
    expect(analyseUrl('https://semakmule.rmp.gov.my').hints).toEqual([]);
  });
});

describe('classifyQuery', () => {
  it('mengelaskan setiap jenis input dengan betul', () => {
    expect(classifyQuery('').kind).toBe('kosong');
    expect(classifyQuery('012-345 6789').kind).toBe('telefon');
    expect(classifyQuery('514012345678').kind).toBe('akaun_bank');
    expect(classifyQuery('contoh-tipu.xyz').kind).toBe('url');
    expect(classifyQuery('Syarikat Pelaburan Maju Jaya').kind).toBe('syarikat');
  });

  it('menyenaraikan bacaan alternatif apabila input taksa', () => {
    // 10 digit bermula 01 boleh jadi telefon ATAU nombor akaun bank.
    const hasil = classifyQuery('0123456789');
    expect(hasil.kind).toBe('telefon');
    expect(hasil.alternatives).toContain('akaun_bank');
  });

  it('tidak pernah mengembalikan jenis di luar senarai yang diketahui', () => {
    const jenis = ['telefon', 'akaun_bank', 'url', 'syarikat', 'kosong'];
    for (const input of ['', 'abc', '999', 'http://a.b.c.d.e.contoh.xyz', '+60123456789']) {
      expect(jenis).toContain(classifyQuery(input).kind);
    }
  });
});
