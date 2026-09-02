'use client';

import { useActionState, useId } from 'react';
import { useFormStatus } from 'react-dom';
import { logMasuk, type KeadaanMasuk } from '@/app/moderasi/actions';
import type { Dictionary } from '@/lib/i18n';

function Butang({ teks }: { teks: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn--primary btn--block" disabled={pending}>
      {teks}
    </button>
  );
}

export function BorangMasuk({ d }: { d: Dictionary['moderasi'] }) {
  const [keadaan, tindakan] = useActionState<KeadaanMasuk, FormData>(logMasuk, {});
  const id = useId();

  return (
    <form action={tindakan} className="stack" noValidate>
      {keadaan.gagal ? (
        <div className="notis notis--bahaya" role="alert">
          <p style={{ marginBottom: 0 }}>{d.masukGagal}</p>
        </div>
      ) : null}

      <div className="field">
        <label className="field__label" htmlFor={`${id}-id`}>
          {d.masukId}
        </label>
        <input id={`${id}-id`} name="id" className="input" type="text" autoComplete="username" required />
      </div>

      <div className="field">
        <label className="field__label" htmlFor={`${id}-token`}>
          {d.masukToken}
        </label>
        <input
          id={`${id}-token`}
          name="token"
          className="input"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>

      <Butang teks={d.masukCta} />
    </form>
  );
}
