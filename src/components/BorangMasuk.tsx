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
      {keadaan.gagal || keadaan.totpGagal ? (
        <div className="notis notis--bahaya" role="alert">
          <p style={{ marginBottom: 0 }}>{keadaan.totpGagal ? d.masukTotpGagal : d.masukGagal}</p>
        </div>
      ) : null}

      {/* Langkah kedua: identiti dibawa oleh token pra-sesi bertandatangan. */}
      {keadaan.perluTotp && keadaan.pra ? <input type="hidden" name="pra" value={keadaan.pra} /> : null}

      <div className="field" hidden={keadaan.perluTotp === true}>
        <label className="field__label" htmlFor={`${id}-id`}>
          {d.masukId}
        </label>
        {/* ID dikembalikan selepas peringkat pertama supaya pengguna tidak
            perlu menaipnya semula sebelum memasukkan kod pengesahan. */}
        <input
          id={`${id}-id`}
          name="id"
          className="input"
          type="text"
          autoComplete="username"
          defaultValue={keadaan.id ?? ''}
          required={keadaan.perluTotp !== true}
        />
      </div>

      <div className="field" hidden={keadaan.perluTotp === true}>
        <label className="field__label" htmlFor={`${id}-token`}>
          {d.masukToken}
        </label>
        <input
          id={`${id}-token`}
          name="token"
          className="input"
          type="password"
          autoComplete="current-password"
          required={keadaan.perluTotp !== true}
        />
      </div>

      {/* Faktor kedua diminta hanya selepas kelayakan pertama betul. */}
      {keadaan.perluTotp ? (
        <div className="field">
          <p className="field__bantuan" style={{ margin: '0 0 0.5rem' }}>
            {d.sebagai}: {keadaan.id}
          </p>
          <label className="field__label" htmlFor={`${id}-totp`}>
            {d.masukTotp}
          </label>
          <input
            id={`${id}-totp`}
            name="totp"
            className="input"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]{6}"
            maxLength={6}
            aria-describedby={`${id}-totp-bantuan`}
            required
            autoFocus
          />
          <p className="field__bantuan" id={`${id}-totp-bantuan`}>
            {d.masukTotpBantuan}
          </p>
        </div>
      ) : null}

      <Butang teks={d.masukCta} />
    </form>
  );
}
