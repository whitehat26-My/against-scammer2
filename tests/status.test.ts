import { describe, expect, it } from 'vitest';
import {
  labelDenganKiraan,
  PERKATAAN_TERLARANG,
  REPORT_STATUSES,
  STATUS_META,
  statusTersiar,
} from '@/lib/status';

/**
 * Ujian ini menguatkuasakan keperluan anti-fitnah platform.
 * Jika ujian ini gagal, jangan longgarkan ujian — betulkan label.
 */
describe('sistem status anti-fitnah', () => {
  it('tidak mempunyai status yang bermaksud pengesahan jenayah', () => {
    const semuaTeks = REPORT_STATUSES.flatMap((s) => {
      const meta = STATUS_META[s];
      return [s, meta.label_ms, meta.label_en, meta.keterangan_ms, meta.keterangan_en];
    })
      .join(' ')
      .toLowerCase();

    for (const larangan of PERKATAAN_TERLARANG) {
      expect(semuaTeks, `label status tidak boleh mengandungi "${larangan}"`).not.toContain(larangan);
    }
  });

  it('hanya menyediakan tiga status yang dipersetujui', () => {
    expect([...REPORT_STATUSES]).toEqual(['belum_disemak', 'dilaporkan_komuniti', 'dipertikai']);
  });

  it('tidak menerbitkan laporan yang belum disemak (moderation-first)', () => {
    expect(statusTersiar('belum_disemak')).toBe(false);
    expect(statusTersiar('dilaporkan_komuniti')).toBe(true);
    expect(statusTersiar('dipertikai')).toBe(true);
  });

  it('kekal "dilaporkan" walau berapa ramai pun pelapor', () => {
    expect(labelDenganKiraan('dilaporkan_komuniti', 12, 'ms')).toBe('Dilaporkan komuniti (×12)');
    expect(labelDenganKiraan('dilaporkan_komuniti', 12, 'en')).toBe('Reported by community (×12)');
    expect(labelDenganKiraan('dilaporkan_komuniti', 1, 'ms')).toBe('Dilaporkan komuniti');
  });

  it('tidak menaik taraf status berdasarkan bilangan laporan', () => {
    // Tiada fungsi yang menukar status berdasarkan kiraan — kiraan hanya label.
    for (const bilangan of [1, 5, 50, 500]) {
      expect(labelDenganKiraan('dilaporkan_komuniti', bilangan, 'ms')).toMatch(/^Dilaporkan komuniti/);
    }
  });
});
