'use client';

import { useActionState, useId } from 'react';
import { useFormStatus } from 'react-dom';
import { langganDigest, type KeadaanDigest } from '@/app/berita/actions';
import type { Dictionary } from '@/lib/i18n';

function Butang({ d }: { d: Dictionary['digest'] }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn--primary" disabled={pending}>
      {pending ? d.menghantar : d.hantar}
    </button>
  );
}

export function BorangDigest({ d }: { d: Dictionary['digest'] }) {
  const [keadaan, tindakan] = useActionState<KeadaanDigest, FormData>(langganDigest, {});
  const id = useId();
  const semula = keadaan.semula;

  if (keadaan.ok) {
    return (
      <div className="notis notis--info" role="status">
        <p style={{ marginBottom: 0 }}>{d.jaya}</p>
      </div>
    );
  }

  return (
    <form action={tindakan} className="stack" noValidate>
      {keadaan.ralat ? (
        <div className="notis notis--bahaya" role="alert">
          <p style={{ marginBottom: 0 }}>{d.ralat[keadaan.ralat]}</p>
        </div>
      ) : null}

      <div className="field">
        <label className="field__label" htmlFor={`${id}-emel`}>
          {d.emel}
        </label>
        <input
          id={`${id}-emel`}
          name="emel"
          className="input"
          type="email"
          autoComplete="email"
          defaultValue={semula?.emel ?? ''}
          aria-describedby={`${id}-bantuan`}
          required
        />
        <p className="field__bantuan" id={`${id}-bantuan`}>
          {d.emelBantuan}
        </p>
      </div>

      <div className="field field--semak">
        <label className="semak-label">
          <input type="checkbox" name="pdpa" value="ya" defaultChecked={semula?.pdpa ?? false} required />
          <span>{d.pdpa}</span>
        </label>
      </div>

      <div className="btnrow">
        <Butang d={d} />
      </div>
      <p className="small muted" style={{ marginBottom: 0 }}>
        {d.nota}
      </p>
    </form>
  );
}
