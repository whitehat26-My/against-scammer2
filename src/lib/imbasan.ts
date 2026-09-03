import net from 'node:net';

/**
 * Imbasan malware untuk fail bukti yang dimuat naik.
 *
 * Menyokong ClamAV melalui protokol INSTREAM clamd:
 *   IMBASAN_MALWARE=clamav
 *   CLAMD_HOS=127.0.0.1
 *   CLAMD_PORT=3310
 *
 * Dasar: jika pengimbas dikonfigurasi tetapi tidak dapat dihubungi, muat naik
 * DITOLAK (gagal-tutup). Jika tiada pengimbas dikonfigurasi, muat naik
 * diterima — pertahanan lain masih terpakai: pengesahan bait ajaib, pembuangan
 * metadata, fail disimpan di luar laluan yang boleh dilaksanakan, dan akses
 * hanya melalui laluan yang memerlukan log masuk moderator.
 */

export type KeputusanImbasan = 'bersih' | 'dijangkiti' | 'ralat' | 'tiada-pengimbas';

export function pengimbasDikonfigurasi(): boolean {
  return process.env.IMBASAN_MALWARE?.trim() === 'clamav';
}

const SAIZ_KEPING = 64 * 1024;

/** Hantar bait ke clamd melalui INSTREAM dan tafsirkan jawapannya. */
export function imbasDenganClamd(
  bait: Uint8Array,
  hos: string,
  port: number,
  masaTamatMs = 10_000,
): Promise<KeputusanImbasan> {
  return new Promise((selesai) => {
    let dijawab = false;
    const jawab = (keputusan: KeputusanImbasan) => {
      if (dijawab) return;
      dijawab = true;
      soket.destroy();
      selesai(keputusan);
    };

    const soket = net.createConnection({ host: hos, port });
    soket.setTimeout(masaTamatMs);

    let balasan = '';
    soket.on('connect', () => {
      soket.write('zINSTREAM\0');
      for (let offset = 0; offset < bait.length; offset += SAIZ_KEPING) {
        const keping = bait.subarray(offset, offset + SAIZ_KEPING);
        const panjang = Buffer.alloc(4);
        panjang.writeUInt32BE(keping.length);
        soket.write(panjang);
        soket.write(Buffer.from(keping));
      }
      soket.write(Buffer.alloc(4)); // panjang sifar menamatkan strim
    });

    soket.on('data', (keping) => {
      balasan += keping.toString('utf8');
      if (!balasan.includes('\0') && !balasan.includes('\n')) return;
      if (/FOUND/.test(balasan)) jawab('dijangkiti');
      else if (/\bOK\b/.test(balasan)) jawab('bersih');
      else jawab('ralat');
    });

    soket.on('timeout', () => jawab('ralat'));
    soket.on('error', () => jawab('ralat'));
    soket.on('close', () => jawab('ralat'));
  });
}

export async function imbasBukti(bait: Uint8Array): Promise<KeputusanImbasan> {
  if (!pengimbasDikonfigurasi()) return 'tiada-pengimbas';
  const hos = process.env.CLAMD_HOS?.trim() || '127.0.0.1';
  const port = Number(process.env.CLAMD_PORT ?? 3310);
  return imbasDenganClamd(bait, hos, Number.isFinite(port) ? port : 3310);
}

/** Adakah keputusan imbasan membenarkan fail disimpan? */
export function imbasanMembenarkan(keputusan: KeputusanImbasan): boolean {
  return keputusan === 'bersih' || keputusan === 'tiada-pengimbas';
}
