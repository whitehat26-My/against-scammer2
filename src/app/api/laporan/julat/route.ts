import { NextResponse } from 'next/server';
import { awalanSah } from '@/lib/laporan/nilai';
import { getStore } from '@/lib/laporan/store';

/**
 * Carian laporan komuniti secara k-anonymity.
 *
 * Pelayar menghantar 5 aksara pertama SHA-256 bagi maklumat yang dicari.
 * Satu awalan itu dikongsi oleh berjuta-juta nilai yang mungkin, jadi pelayan
 * tidak boleh menentukan apa yang dicari. Padanan tepat dibuat dalam pelayar.
 *
 * Endpoint ini TIDAK menyimpan sebarang log permintaan.
 */
export async function GET(request: Request): Promise<NextResponse> {
  const awalan = new URL(request.url).searchParams.get('awalan') ?? '';
  if (!awalanSah(awalan)) {
    return NextResponse.json({ ralat: 'awalan tidak sah' }, { status: 400 });
  }

  try {
    const store = await getStore();
    const padanan = await store.julatIkutAwalan(awalan);
    return NextResponse.json(
      { padanan },
      {
        headers: {
          // Jangan simpan cache bersama: hasil berubah selepas moderasi.
          'cache-control': 'no-store',
          'referrer-policy': 'no-referrer',
        },
      },
    );
  } catch {
    return NextResponse.json({ ralat: 'tidak tersedia' }, { status: 503 });
  }
}
