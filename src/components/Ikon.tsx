type Props = { nama: 'utama' | 'taktik' | 'semak' | 'lapor' | 'bantuan' };

const LALUAN: Record<Props['nama'], string> = {
  utama: 'M3 10.5 12 3l9 7.5M5.5 9.5V20h13V9.5',
  taktik: 'M4 4.5h8.5a2.5 2.5 0 0 1 2.5 2.5V20a2 2 0 0 0-2-2H4zM20 4.5h-4a2 2 0 0 0-2 2V20a2 2 0 0 1 2-2h4z',
  semak: 'M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13ZM15.5 15.5 20 20',
  lapor: 'M5 21V4m0 0h11l-1.8 3.6L16 11H5',
  bantuan: 'M12 3.2 20 7v5.5c0 4.6-3.3 7.7-8 8.9-4.7-1.2-8-4.3-8-8.9V7zM12 9v4m0 3h.01',
};

/** Ikon garisan ringkas untuk navigasi bawah. Hiasan sahaja — label teks kekal. */
export function Ikon({ nama }: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path
        d={LALUAN[nama]}
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
