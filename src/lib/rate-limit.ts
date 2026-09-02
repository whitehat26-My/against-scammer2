import { createHash, randomBytes } from 'node:crypto';

/**
 * Had kadar dalam ingatan.
 *
 * Kunci ialah hash bagi alamat IP dengan garam rawak yang dijana semula setiap
 * kali proses dimulakan, jadi alamat IP tidak pernah disimpan dan kunci tidak
 * boleh dikaitkan merentas mula semula. Untuk berbilang instance, gantikan
 * dengan Redis atau had kadar pada peringkat edge.
 */

const GARAM = randomBytes(16).toString('hex');
const baldi = new Map<string, { kiraan: number; tamat: number }>();

export type HasilHadKadar = { dibenarkan: boolean; bakiSaat: number };

export function hadKadar(pengenal: string, maks: number, tetingkapSaat: number): HasilHadKadar {
  const kunci = createHash('sha256').update(`${GARAM}:${pengenal}`).digest('hex').slice(0, 32);
  const sekarang = Date.now();
  const sedia = baldi.get(kunci);

  if (!sedia || sedia.tamat < sekarang) {
    baldi.set(kunci, { kiraan: 1, tamat: sekarang + tetingkapSaat * 1000 });
    kemasBaldi(sekarang);
    return { dibenarkan: true, bakiSaat: 0 };
  }

  if (sedia.kiraan >= maks) {
    return { dibenarkan: false, bakiSaat: Math.ceil((sedia.tamat - sekarang) / 1000) };
  }

  sedia.kiraan += 1;
  return { dibenarkan: true, bakiSaat: 0 };
}

function kemasBaldi(sekarang: number): void {
  if (baldi.size < 5000) return;
  for (const [kunci, nilai] of baldi) {
    if (nilai.tamat < sekarang) baldi.delete(kunci);
  }
}

/** Untuk ujian. */
export function kosongkanHadKadar(): void {
  baldi.clear();
}
