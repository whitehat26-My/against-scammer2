import { NextResponse } from 'next/server';
import { bacaBukti } from '@/lib/laporan/bukti';
import { moderatorSemasa } from '@/lib/moderator';

/**
 * Bukti imej hanya boleh dibaca oleh moderator yang telah log masuk.
 * Ia tidak pernah didedahkan kepada orang awam.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ nama: string }> },
): Promise<NextResponse> {
  const moderator = await moderatorSemasa();
  if (!moderator) return NextResponse.json({ ralat: 'tidak dibenarkan' }, { status: 401 });

  const { nama } = await params;
  const fail = await bacaBukti(nama);
  if (!fail) return NextResponse.json({ ralat: 'tidak dijumpai' }, { status: 404 });

  return new NextResponse(Buffer.from(fail.bait), {
    headers: {
      'content-type': fail.mime,
      'content-disposition': 'inline',
      'cache-control': 'private, no-store',
      'x-content-type-options': 'nosniff',
      'content-security-policy': "default-src 'none'; sandbox",
    },
  });
}
