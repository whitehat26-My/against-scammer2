import { describe, expect, it } from 'vitest';
import { buangMetadata, kenalPastiImej } from '@/lib/laporan/bukti';

function segmenJpeg(penanda: number, isi: number[]): number[] {
  const panjang = isi.length + 2;
  return [0xff, penanda, panjang >> 8, panjang & 0xff, ...isi];
}

function jpegDenganExif(): Uint8Array {
  return new Uint8Array([
    0xff, 0xd8, // SOI
    ...segmenJpeg(0xe0, [0x4a, 0x46, 0x49, 0x46, 0x00]), // APP0 JFIF (kekal)
    ...segmenJpeg(0xe1, [0x45, 0x78, 0x69, 0x66, 0x00, 0x00, 0x47, 0x50, 0x53]), // APP1 EXIF (dibuang)
    ...segmenJpeg(0xfe, [0x72, 0x61, 0x68, 0x73, 0x69, 0x61]), // COM (dibuang)
    ...segmenJpeg(0xdb, [0x01, 0x02, 0x03]), // DQT (kekal)
    0xff, 0xda, 0x00, 0x04, 0x00, 0x00, 0x11, 0x22, 0x33, // SOS + data
  ]);
}

function chunkPng(jenis: string, isi: number[]): number[] {
  const panjang = isi.length;
  return [
    (panjang >>> 24) & 0xff, (panjang >>> 16) & 0xff, (panjang >>> 8) & 0xff, panjang & 0xff,
    ...[...jenis].map((c) => c.charCodeAt(0)),
    ...isi,
    0, 0, 0, 0, // CRC olok-olok
  ];
}

function pngDenganMetadata(): Uint8Array {
  return new Uint8Array([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
    ...chunkPng('IHDR', [0, 0, 0, 1, 0, 0, 0, 1, 8, 6, 0, 0, 0]),
    ...chunkPng('eXIf', [0x47, 0x50, 0x53]),
    ...chunkPng('tEXt', [0x6c, 0x6f, 0x6b, 0x61, 0x73, 0x69]),
    ...chunkPng('IDAT', [1, 2, 3, 4]),
    ...chunkPng('IEND', []),
  ]);
}

function chunkWebp(jenis: string, isi: number[]): number[] {
  const panjang = isi.length;
  const lapik = panjang % 2 === 1 ? [0] : [];
  return [
    ...[...jenis].map((c) => c.charCodeAt(0)),
    panjang & 0xff, (panjang >>> 8) & 0xff, (panjang >>> 16) & 0xff, (panjang >>> 24) & 0xff,
    ...isi,
    ...lapik,
  ];
}

function webpDenganExif(): Uint8Array {
  const isi = [...chunkWebp('VP8 ', [1, 2, 3, 4]), ...chunkWebp('EXIF', [0x47, 0x50, 0x53, 0x00])];
  const saiz = 4 + isi.length;
  return new Uint8Array([
    0x52, 0x49, 0x46, 0x46,
    saiz & 0xff, (saiz >>> 8) & 0xff, (saiz >>> 16) & 0xff, (saiz >>> 24) & 0xff,
    0x57, 0x45, 0x42, 0x50,
    ...isi,
  ]);
}

const teks = (b: Uint8Array) => new TextDecoder('latin1').decode(b);

describe('pengecaman jenis imej', () => {
  it('mengenal pasti daripada bait, bukan nama fail', () => {
    expect(kenalPastiImej(jpegDenganExif())?.mime).toBe('image/jpeg');
    expect(kenalPastiImej(pngDenganMetadata())?.mime).toBe('image/png');
    expect(kenalPastiImej(webpDenganExif())?.mime).toBe('image/webp');
  });

  it('menolak fail yang bukan imej', () => {
    expect(kenalPastiImej(new TextEncoder().encode('<?php echo 1; ?>'))).toBeUndefined();
    expect(kenalPastiImej(new Uint8Array([0x25, 0x50, 0x44, 0x46]))).toBeUndefined();
    expect(kenalPastiImej(new Uint8Array())).toBeUndefined();
  });
});

describe('pembuangan metadata bukti', () => {
  it('membuang EXIF dan komen daripada JPEG tetapi mengekalkan data imej', () => {
    const bersih = buangMetadata(jpegDenganExif(), { mime: 'image/jpeg', ext: 'jpg' });
    const t = teks(bersih);
    expect(t).not.toContain('Exif');
    expect(t).not.toContain('rahsia');
    expect(t).toContain('JFIF');
    expect(bersih[0]).toBe(0xff);
    expect(bersih[1]).toBe(0xd8);
    // Segmen SOS dan data imej mesti kekal.
    expect([...bersih].join(',')).toContain('255,218');
  });

  it('membuang chunk eXIf dan tEXt daripada PNG', () => {
    const bersih = buangMetadata(pngDenganMetadata(), { mime: 'image/png', ext: 'png' });
    const t = teks(bersih);
    expect(t).not.toContain('eXIf');
    expect(t).not.toContain('tEXt');
    expect(t).toContain('IHDR');
    expect(t).toContain('IDAT');
    expect(t).toContain('IEND');
  });

  it('membuang chunk EXIF daripada WebP dan mengemas kini saiz RIFF', () => {
    const bersih = buangMetadata(webpDenganExif(), { mime: 'image/webp', ext: 'webp' });
    const t = teks(bersih);
    expect(t).not.toContain('EXIF');
    expect(t).toContain('VP8 ');
    const saiz = new DataView(bersih.buffer, bersih.byteOffset).getUint32(4, true);
    expect(saiz).toBe(bersih.length - 8);
  });
});
