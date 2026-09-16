import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(50, Math.max(1, Number(searchParams.get('limit') ?? 20) || 20));

  const rows = await prisma.user.findMany({
    where: { totalCoinPoints: { gt: 0 } },
    orderBy: [{ totalCoinPoints: 'desc' }, { username: 'asc' }],
    take: limit,
    select: { username: true, totalCoinPoints: true, totalCoinsCollected: true },
  });

  return NextResponse.json({
    kind: 'coinPoints',
    entries: rows.map((r, i) => ({
      rank: i + 1,
      username: r.username,
      value: r.totalCoinPoints,
      coinsCollected: r.totalCoinsCollected,
    })),
  });
}
