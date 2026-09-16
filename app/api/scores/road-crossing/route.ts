import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { COIN_POINTS_VALUE } from '@/lib/gameConstants';
import { prisma } from '@/lib/prisma';

const MAX_SCORE = 50_000;
const MAX_COINS = 2_000;

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Not logged in.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const score = Math.floor(Number(body.score ?? 0));
    const coinsCollected = Math.floor(Number(body.coinsCollected ?? 0));
    const coinPoints = Math.floor(Number(body.coinPoints ?? 0));

    if (
      !Number.isFinite(score) ||
      !Number.isFinite(coinsCollected) ||
      !Number.isFinite(coinPoints) ||
      score < 0 ||
      score > MAX_SCORE ||
      coinsCollected < 0 ||
      coinsCollected > MAX_COINS ||
      coinPoints !== coinsCollected * COIN_POINTS_VALUE
    ) {
      return NextResponse.json({ error: 'Invalid score payload.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: session.userId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    const roadBestScore = Math.max(user.roadBestScore, score);
    const totalCoinPoints = user.totalCoinPoints + coinPoints;
    const totalCoinsCollected = user.totalCoinsCollected + coinsCollected;

    const updated = await prisma.user.update({
      where: { id: session.userId },
      data: { roadBestScore, totalCoinPoints, totalCoinsCollected },
      select: {
        username: true,
        roadBestScore: true,
        totalCoinPoints: true,
        totalCoinsCollected: true,
      },
    });

    return NextResponse.json({
      stats: updated,
      run: { score, coinsCollected, coinPoints },
      newBestScore: score > user.roadBestScore,
    });
  } catch (err) {
    console.error('road-crossing score error', err);
    return NextResponse.json({ error: 'Could not save score.' }, { status: 500 });
  }
}
