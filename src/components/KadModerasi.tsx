import { tindakanModerasi } from '@/app/moderasi/actions';
import type { Dictionary, Lang } from '@/lib/i18n';
import type { Laporan, TindakanModerator } from '@/lib/laporan/types';
import { labelDenganKiraan, statusLabel } from '@/lib/status';

/**
 * Satu laporan dalam giliran moderasi.
 * Butiran pelapor dan bukti hanya kelihatan di sini — tidak pernah kepada awam.
 */
export function KadModerasi({
  laporan,
  d,
  dLapor,
  lang,
  tindakan,
}: {
  laporan: Laporan;
  d: Dictionary['moderasi'];
  dLapor: Dictionary['lapor'];
  lang: Lang;
  tindakan: TindakanModerator[];
}) {
  return (
    <article className="panel stack">
      <div className="chips">
        <span className="badge badge--neutral">{statusLabel(laporan.status, lang)}</span>
        <span className="chip">{dLapor.jenis[laporan.jenis_kenalan]}</span>
        <span className="chip">
          {d.sokongan}: {laporan.bilangan_sokongan}
        </span>
      </div>

      <h3 style={{ overflowWrap: 'anywhere', marginBottom: 0 }}>{laporan.nilai_kenalan}</h3>
      <p className="small muted" style={{ marginBottom: 0 }}>
        {labelDenganKiraan(laporan.status, laporan.bilangan_sokongan, lang)} · {laporan.tarikh_hantar.slice(0, 16).replace('T', ' ')}
      </p>

      <p style={{ whiteSpace: 'pre-wrap', marginBottom: 0 }}>{laporan.penerangan}</p>

      <p className="small muted" style={{ marginBottom: 0 }}>
        {d.pelaporEmel}: {laporan.pelapor_emel ?? d.tanpaNama}
        {laporan.kategori_slug ? ` · ${laporan.kategori_slug}` : ''}
      </p>

      <div>
        <p className="field__label">{d.buktiTitle}</p>
        {laporan.bukti.length === 0 ? (
          <p className="small muted" style={{ marginBottom: 0 }}>
            {d.buktiTiada}
          </p>
        ) : (
          <ul className="bukti-senarai">
            {laporan.bukti.map((nama) => (
              <li key={nama}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/api/bukti/${nama}`} alt="" loading="lazy" />
              </li>
            ))}
          </ul>
        )}
      </div>

      <form action={tindakanModerasi} className="stack">
        <input type="hidden" name="laporan_id" value={laporan.id} />
        <div className="field">
          <label className="field__label" htmlFor={`sebab-${laporan.id}`}>
            {d.sebabLabel}
          </label>
          <input id={`sebab-${laporan.id}`} name="sebab" className="input" type="text" maxLength={500} />
        </div>
        <div className="btnrow">
          {tindakan.map((t) => (
            <button
              key={t}
              type="submit"
              name="tindakan"
              value={t}
              className={t === 'terima' ? 'btn btn--primary' : t === 'buang' ? 'btn btn--danger' : 'btn btn--secondary'}
            >
              {d.tindakan[t]}
            </button>
          ))}
        </div>
      </form>
    </article>
  );
}
