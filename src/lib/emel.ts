/**
 * Penghantar e-mel.
 *
 * Portal ini tidak membundelkan penyedia e-mel. Sambungkan penyedia anda di
 * sini (SMTP, Resend, SES, dan sebagainya) dengan melaksanakan `PenghantarEmel`.
 *
 * Sehingga satu penghantar dikonfigurasi, borang digest TIDAK dipaparkan —
 * kami tidak menjanjikan e-mel yang tidak dapat dihantar.
 *
 *   EMEL_PENGHANTAR=log   → tulis e-mel ke log pelayan (pembangunan & ujian)
 *   EMEL_PENGHANTAR=<lain> → laksanakan di bawah
 */

export interface PenghantarEmel {
  hantar(kepada: string, subjek: string, teks: string): Promise<void>;
}

/** Penghantar pembangunan: mencetak e-mel ke log pelayan, tidak menghantar apa-apa. */
const penghantarLog: PenghantarEmel = {
  async hantar(kepada, subjek, teks) {
    console.info(`[emel:log] kepada=${kepada}\nsubjek=${subjek}\n${teks}\n`);
  },
};

export function penghantarEmel(): PenghantarEmel | undefined {
  if (process.env.EMEL_PENGHANTAR === 'log') return penghantarLog;
  return undefined;
}

/** Adakah modul digest boleh dipaparkan kepada pengguna? */
export function digestAktif(): boolean {
  return penghantarEmel() !== undefined;
}
