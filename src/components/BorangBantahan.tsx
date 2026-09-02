'use client';

import { useActionState, useId, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { hantarBantahan, type KeadaanBantahan } from '@/app/laporan/actions';
import type { Dictionary } from '@/lib/i18n';

function Butang({ teks }: { teks: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn--secondary" disabled={pending}>
      {teks}
    </button>
  );
}

export function BorangBantahan({
  laporanId,
  d,
  ralatTeks,
}: {
  laporanId: string;
  d: Dictionary['laporanAwam'];
  ralatTeks: Dictionary['lapor']['ralat'];
}) {
  const [keadaan, tindakan] = useActionState<KeadaanBantahan, FormData>(hantarBantahan, {});
  const [buka, setBuka] = useState(false);
  const id = useId();
  const semula = keadaan.semula;

  if (keadaan.ok) {
    return (
      <div className="notis notis--info" role="status">
        <p style={{ marginBottom: 0 }}>{d.bantahJaya}</p>
      </div>
    );
  }

  const ralat = (medan: keyof NonNullable<KeadaanBantahan['ralat']>) => {
    const kod = keadaan.ralat?.[medan];
    return kod ? ralatTeks[kod] : undefined;
  };

  if (!buka) {
    return (
      <button type="button" className="btn btn--secondary" onClick={() => setBuka(true)}>
        {d.bantahCta}
      </button>
    );
  }

  return (
    <form action={tindakan} className="stack" noValidate>
      <input type="hidden" name="laporan_id" value={laporanId} />

      {keadaan.umum ? (
        <div className="notis notis--bahaya" role="alert">
          <p style={{ marginBottom: 0 }}>{ralatTeks[keadaan.umum]}</p>
        </div>
      ) : null}

      <div className="field">
        <label className="field__label" htmlFor={`${id}-nama`}>
          {d.bantahNama}
        </label>
        <input
          id={`${id}-nama`}
          name="pembantah_nama"
          className="input"
          type="text"
          defaultValue={semula?.pembantah_nama ?? ''}
          required
        />
        {ralat('pembantah_nama') ? <p className="ralat">{ralat('pembantah_nama')}</p> : null}
      </div>

      <div className="field">
        <label className="field__label" htmlFor={`${id}-emel`}>
          {d.bantahEmel}
        </label>
        <input
          id={`${id}-emel`}
          name="pembantah_emel"
          className="input"
          type="email"
          defaultValue={semula?.pembantah_emel ?? ''}
          required
        />
        {ralat('pembantah_emel') ? <p className="ralat">{ralat('pembantah_emel')}</p> : null}
      </div>

      <div className="field">
        <label className="field__label" htmlFor={`${id}-hujah`}>
          {d.bantahHujah}
        </label>
        <textarea
          id={`${id}-hujah`}
          name="hujah"
          className="input"
          rows={5}
          defaultValue={semula?.hujah ?? ''}
          required
        />
        {ralat('hujah') ? <p className="ralat">{ralat('hujah')}</p> : null}
      </div>

      <div className="field field--semak">
        <label className="semak-label">
          <input type="checkbox" name="pdpa" value="ya" defaultChecked={semula?.pdpa ?? false} required />
          <span>{d.bantahPdpa}</span>
        </label>
        {ralat('pdpa') ? <p className="ralat">{ralat('pdpa')}</p> : null}
      </div>

      <Butang teks={d.bantahCta} />
    </form>
  );
}
