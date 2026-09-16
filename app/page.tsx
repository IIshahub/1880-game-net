'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getAllGames } from '@/gameManager';

export default function HomePage() {
  const router = useRouter();
  const games = getAllGames();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setUsername(data?.user?.username ?? null))
      .catch(() => setUsername(null));
  }, []);

  const handleGameSelect = (gameId: string) => {
    router.push(`/game/${gameId}`);
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/login');
    router.refresh();
  };

  return (
    <div className="game-menu">
      <div className="game-menu-overlay"></div>
      <div className="game-menu-content">
        <div className="game-menu-header">
          <h1 className="game-menu-title">
            <span className="game-menu-icon">🎮</span>
            <span>Select Game</span>
          </h1>
          {username ? (
            <div className="auth-user-bar">
              <span>@{username}</span>
              <button type="button" onClick={() => router.push('/leaderboard')}>
                Leaderboards
              </button>
              <button type="button" onClick={logout}>
                Log out
              </button>
            </div>
          ) : null}
        </div>
        <div className="game-cards">
          {games.map((game) => (
            <div
              key={game.key}
              className="game-card"
              style={{ borderColor: game.color }}
              onClick={() => handleGameSelect(game.key)}
            >
              <div className="game-card-icon">{game.icon}</div>
              <h3 className="game-card-name">{game.name}</h3>
              <p className="game-card-description">{game.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
