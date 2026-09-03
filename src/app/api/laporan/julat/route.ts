import { NextResponse } from 'next/server';
import { awalanSah } from '@/lib/laporan/nilai';
import { getStore } from '@/lib/laporan/store';
import { hadKadar } from '@/lib/rate-limit';

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

  // Had kadar: menghalang penyalahgunaan endpoint ini. Alat semakan menghantar
  // paling banyak dua permintaan setiap carian, jadi 120 dalam lima minit
  // membenarkan kira-kira 60 carian — longgar untuk seorang manusia, dan juga
  // untuk beberapa orang yang berkongsi satu IP pejabat.
  const h = request.headers;
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'tempatan';
  if (!hadKadar(`julat:${ip}`, 120, 5 * 60).dibenarkan) {
    return NextResponse.json({ ralat: 'terlalu banyak permintaan' }, { status: 429, headers: { 'retry-after': '300' } });
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
