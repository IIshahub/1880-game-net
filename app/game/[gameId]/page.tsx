'use client';

import { useParams, useRouter } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { getGame } from '@/gameManager';
import LoadingScreen from '@/components/LoadingScreen';

const RoadCrossingGame = dynamic(() => import('@/components/RoadCrossingGame'), {
  ssr: false,
  loading: () => <LoadingScreen title="Loading Road Crossing" />,
});
const ChessGame = dynamic(() => import('@/components/ChessGame'), {
  ssr: false,
  loading: () => <LoadingScreen title="Loading Chess" />,
});
const XOGame = dynamic(() => import('@/components/XOGame'), {
  ssr: false,
  loading: () => <LoadingScreen title="Loading Tic Tac Toe" />,
});

export default function GamePage() {
  const params = useParams();
  const router = useRouter();
  const gameId = params.gameId as string;
  const game = getGame(gameId);

  useEffect(() => {
    if (!game) {
      router.push('/');
    }
  }, [game, router]);

  if (!game) {
    return <LoadingScreen title="Loading" />;
  }

  if (gameId === 'roadCrossing') {
    return (
      <Suspense fallback={<LoadingScreen title="Loading Road Crossing" />}>
        <RoadCrossingGame />
      </Suspense>
    );
  }

  if (gameId === 'chess') {
    return (
      <Suspense fallback={<LoadingScreen title="Loading Chess" />}>
        <ChessGame />
      </Suspense>
    );
  }

  if (gameId === 'xo') {
    return (
      <Suspense fallback={<LoadingScreen title="Loading Tic Tac Toe" />}>
        <XOGame />
      </Suspense>
    );
  }

  return (
    <div className="game-screen">
      <h1>Game not found</h1>
      <button type="button" onClick={() => router.push('/')}>
        Back to Menu
      </button>
    </div>
  );
}
