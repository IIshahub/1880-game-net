'use client';

import { useRouter } from 'next/navigation';
import { getAllGames } from '@/gameManager';

export default function HomePage() {
  const router = useRouter();
  const games = getAllGames();

  const handleGameSelect = (gameId: string) => {
    router.push(`/game/${gameId}`);
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

