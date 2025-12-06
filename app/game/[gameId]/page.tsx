'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { getGame } from '@/gameManager';

// Dynamic imports to prevent SSR issues
const RoadCrossingGame = dynamic(() => import('@/components/RoadCrossingGame'), { 
  ssr: false,
  loading: () => <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '24px' }}>Loading Road Crossing...</div>
});
const ChessGame = dynamic(() => import('@/components/ChessGame'), { 
  ssr: false,
  loading: () => <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '24px' }}>Loading Chess...</div>
});
const XOGame = dynamic(() => import('@/components/XOGame'), { 
  ssr: false,
  loading: () => <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '24px' }}>Loading Tic Tac Toe...</div>
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
    return null;
  }

  if (gameId === 'roadCrossing') {
    return (
      <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '24px' }}>Loading Road Crossing...</div>}>
        <RoadCrossingGame />
      </Suspense>
    );
  }

  if (gameId === 'chess') {
    return (
      <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '24px' }}>Loading Chess...</div>}>
        <ChessGame />
      </Suspense>
    );
  }

  if (gameId === 'xo') {
    return (
      <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '24px' }}>Loading Tic Tac Toe...</div>}>
        <XOGame />
      </Suspense>
    );
  }

  return (
    <div className="game-screen">
      <h1>Game not found</h1>
      <button onClick={() => router.push('/')}>Back to Menu</button>
    </div>
  );
}

