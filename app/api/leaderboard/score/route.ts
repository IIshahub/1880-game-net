import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(50, Math.max(1, Number(searchParams.get('limit') ?? 20) || 20));

  const rows = await prisma.user.findMany({
    where: { roadBestScore: { gt: 0 } },
    orderBy: [{ roadBestScore: 'desc' }, { username: 'asc' }],
    take: limit,
    select: { username: true, roadBestScore: true },
  });

  return NextResponse.json({
    kind: 'roadScore',
    entries: rows.map((r, i) => ({
      rank: i + 1,
      username: r.username,
      value: r.roadBestScore,
    })),
  });
}
