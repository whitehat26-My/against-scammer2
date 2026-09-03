'use client';

import { useActionState, useId, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { hantarLaporan, type KeadaanBorang } from '@/app/lapor/actions';
import { JENIS_KENALAN, type JenisKenalan } from '@/lib/laporan/types';
import { MAKS_FAIL } from '@/lib/laporan/bukti.client';
import { WidgetCaptcha } from './WidgetCaptcha';
import type { Dictionary } from '@/lib/i18n';

type Kategori = { slug: string; nama: string };

function MedanRalat({ teks, htmlFor }: { teks?: string; htmlFor: string }) {
  if (!teks) return null;
  return (
    <p className="ralat" id={`${htmlFor}-ralat`} role="alert">
      {teks}
    </p>
  );
}

function ButangHantar({ d }: { d: Dictionary['lapor'] }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn--primary btn--block" disabled={pending}>
      {pending ? d.menghantar : d.hantar}
    </button>
  );
}

export function BorangLaporan({
  d,
  kategori,
  jenisAwal,
  captcha,
}: {
  d: Dictionary['lapor'];
  kategori: Kategori[];
  jenisAwal?: JenisKenalan;
  captcha?: { penyedia: 'turnstile' | 'hcaptcha'; kunciTapak: string };
}) {
  const [keadaan, tindakan] = useActionState<KeadaanBorang, FormData>(hantarLaporan, {});
  const id = useId();
  // React menetapkan semula borang selepas satu action. `semula` mengembalikan
  // apa yang pengguna taip supaya satu medan yang tersilap tidak memadam semua.
  //
  // <input> dan <textarea> pulih daripada `defaultValue` selepas form.reset().
  // <select> tidak, jadi ia dipasang semula melalui `key` yang berubah pada
  // setiap jawapan tindakan.
  const semula = keadaan.semula;
  const cap = keadaan.cap ?? 'awal';
  // Cap masa muat borang: penghantaran yang terlalu pantas hampir pasti bot.
  const [dimuatPada] = useState(() => Date.now());

  const ralat = (medan: keyof NonNullable<KeadaanBorang['ralat']>) => {
    const kod = keadaan.ralat?.[medan];
    return kod ? d.ralat[kod] : undefined;
  };

  return (
    <form action={tindakan} className="stack" noValidate>
      {keadaan.umum ? (
        <div className="notis notis--bahaya" role="alert">
          <p style={{ marginBottom: 0 }}>{d.ralat[keadaan.umum]}</p>
        </div>
      ) : null}

      <div className="field">
        <label className="field__label" htmlFor={`${id}-jenis`}>
          {d.medan.jenis}
        </label>
        <select
          id={`${id}-jenis`}
          key={`jenis-${cap}`}
          name="jenis_kenalan"
          className="input"
          defaultValue={semula?.jenis_kenalan || jenisAwal || ''}
          aria-describedby={ralat('jenis_kenalan') ? `${id}-jenis-ralat` : undefined}
          required
        >
          <option value="">{d.medan.jenisPilih}</option>
          {JENIS_KENALAN.map((j) => (
            <option key={j} value={j}>
              {d.jenis[j]}
            </option>
          ))}
        </select>
        <MedanRalat teks={ralat('jenis_kenalan')} htmlFor={`${id}-jenis`} />
      </div>

      <div className="field">
        <label className="field__label" htmlFor={`${id}-nilai`}>
          {d.medan.nilai}
        </label>
        <input
          id={`${id}-nilai`}
          name="nilai_kenalan"
          className="input"
          type="text"
          autoComplete="off"
          defaultValue={semula?.nilai_kenalan ?? ''}
          aria-describedby={`${id}-nilai-bantuan`}
          required
        />
        <p className="field__bantuan" id={`${id}-nilai-bantuan`}>
          {d.medan.nilaiBantuan}
        </p>
        <MedanRalat teks={ralat('nilai_kenalan')} htmlFor={`${id}-nilai`} />
      </div>

      <div className="field">
        <label className="field__label" htmlFor={`${id}-kategori`}>
          {d.medan.kategori}
        </label>
        <select
          id={`${id}-kategori`}
          key={`kategori-${cap}`}
          name="kategori_slug"
          className="input"
          defaultValue={semula?.kategori_slug ?? ''}
        >
          <option value="">{d.medan.kategoriKosong}</option>
          {kategori.map((k) => (
            <option key={k.slug} value={k.slug}>
              {k.nama}
            </option>
          ))}
        </select>
        <MedanRalat teks={ralat('kategori_slug')} htmlFor={`${id}-kategori`} />
      </div>

      <div className="field">
        <label className="field__label" htmlFor={`${id}-penerangan`}>
          {d.medan.penerangan}
        </label>
        <textarea
          id={`${id}-penerangan`}
          name="penerangan"
          className="input"
          rows={6}
          defaultValue={semula?.penerangan ?? ''}
          aria-describedby={`${id}-penerangan-bantuan`}
          required
        />
        <p className="field__bantuan" id={`${id}-penerangan-bantuan`}>
          {d.medan.peneranganBantuan}
        </p>
        <MedanRalat teks={ralat('penerangan')} htmlFor={`${id}-penerangan`} />
      </div>

      <div className="field">
        <label className="field__label" htmlFor={`${id}-bukti`}>
          {d.medan.bukti}
        </label>
        <input
          id={`${id}-bukti`}
          name="bukti"
          className="input"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          max={MAKS_FAIL}
          aria-describedby={`${id}-bukti-bantuan`}
        />
        <p className="field__bantuan" id={`${id}-bukti-bantuan`}>
          {d.medan.buktiBantuan}
        </p>
      </div>

      <div className="field">
        <label className="field__label" htmlFor={`${id}-emel`}>
          {d.medan.emel}
        </label>
        <input
          id={`${id}-emel`}
          name="pelapor_emel"
          className="input"
          type="email"
          autoComplete="email"
          defaultValue={semula?.pelapor_emel ?? ''}
          aria-describedby={`${id}-emel-bantuan`}
        />
        <p className="field__bantuan" id={`${id}-emel-bantuan`}>
          {d.medan.emelBantuan}
        </p>
        <MedanRalat teks={ralat('pelapor_emel')} htmlFor={`${id}-emel`} />
      </div>

      {captcha ? (
        <WidgetCaptcha penyedia={captcha.penyedia} kunciTapak={captcha.kunciTapak} label={d.captchaLabel} />
      ) : null}

      {/*
        Medan umpan: disembunyikan daripada manusia dan pembaca skrin, tetapi
        bot yang mengisi setiap medan akan mengisinya juga.
      */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }}>
        <label htmlFor={`${id}-laman`}>Jangan isi medan ini</label>
        <input id={`${id}-laman`} name="laman_web" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>
      <input type="hidden" name="dimuat_pada" value={dimuatPada} />

      <div className="field field--semak">
        <label className="semak-label">
          <input type="checkbox" name="pdpa" value="ya" defaultChecked={semula?.pdpa ?? false} required />
          <span>{d.medan.pdpa}</span>
        </label>
        <MedanRalat teks={ralat('pdpa')} htmlFor={`${id}-pdpa`} />
      </div>

      <ButangHantar d={d} />
    </form>
  );
}
