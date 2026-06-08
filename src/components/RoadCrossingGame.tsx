'use client';

import { Canvas } from '@react-three/fiber';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import * as THREE from 'three';
import { GameControlsProvider } from '../road-crossing/GameContext';
import { RoadCrossingScene } from '../road-crossing/RoadCrossingScene';
import { setTheme, getCurrentThemeName } from '../themeManager';
import { setCharacter, getCurrentCharacterId } from '../characterManager';
import ThemeModal from './ThemeModal';
import CharacterModal from './CharacterModal';
import { useGameControls } from '../hooks/useGameControls';

export default function RoadCrossingGame() {
  return (
    <GameControlsProvider>
      <RoadCrossingGameContent />
    </GameControlsProvider>
  );
}

function RoadCrossingGameContent() {
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showCharacterModal, setShowCharacterModal] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [sceneKey, setSceneKey] = useState(0);
  const [themeKey, setThemeKey] = useState(getCurrentThemeName());
  const [characterKey, setCharacterKey] = useState(getCurrentCharacterId());
  const router = useRouter();

  useGameControls();

  const resetGame = useCallback(() => {
    setScore(0);
    setGameOver(false);
    setSceneKey((k) => k + 1);
  }, []);

  const handleThemeChange = (themeName: string) => {
    setTheme(themeName);
    setThemeKey(themeName);
    setShowThemeModal(false);
    resetGame();
  };

  const handleCharacterChange = (characterId: string) => {
    setCharacter(characterId);
    setCharacterKey(characterId);
    setShowCharacterModal(false);
    resetGame();
  };

  return (
      <div className="game-screen">
        <button
          onClick={() => router.push('/')}
          style={{
            position: 'fixed',
            top: '20px',
            left: '20px',
            zIndex: 1002,
            padding: '10px 20px',
            backgroundColor: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
          }}
        >
          ← Back to Menu
        </button>

        <button
          className="theme-open-button"
          onClick={() => setShowThemeModal(true)}
          style={{ position: 'fixed', top: '20px', right: '90px', zIndex: 1001 }}
        >
          🎨
        </button>
        <button
          className="theme-open-button"
          onClick={() => setShowCharacterModal(true)}
          style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1001 }}
        >
          👤
        </button>

        <ThemeModal
          isOpen={showThemeModal}
          onClose={() => setShowThemeModal(false)}
          onThemeChange={handleThemeChange}
        />

        <CharacterModal
          isOpen={showCharacterModal}
          onClose={() => setShowCharacterModal(false)}
          onCharacterChange={handleCharacterChange}
        />

        <Canvas
          className="game"
          shadows
          gl={{ antialias: true }}
          onCreated={({ gl, camera }) => {
            gl.shadowMap.enabled = true;
            gl.shadowMap.type = THREE.PCFSoftShadowMap;
            if (camera instanceof THREE.OrthographicCamera) {
              camera.up.set(0, 0, 1);
            }
          }}
          orthographic
          camera={{ position: [300, -300, 300], near: 100, far: 900, zoom: 1 }}
        >
          <RoadCrossingScene
            key={`${sceneKey}-${themeKey}`}
            characterKey={characterKey}
            onScoreChange={setScore}
            onGameOver={(finalScore) => {
              setScore(finalScore);
              setGameOver(true);
            }}
            gameOver={gameOver}
          />
        </Canvas>

        <div id="controls">
          <div>
            <button id="forward">▲</button>
            <button id="left">◀</button>
            <button id="backward">▼</button>
            <button id="right">▶</button>
          </div>
        </div>

        <div id="score">{score}</div>

        <div
          id="result-container"
          style={{ visibility: gameOver ? 'visible' : 'hidden' }}
        >
          <div id="result">
            <h1>Game Over</h1>
            <p>
              Your score: <span id="final-score">{score}</span>
            </p>
            <button id="retry" onClick={resetGame}>
              Retry
            </button>
            <button onClick={() => router.push('/')} style={{ marginTop: '10px' }}>
              Back to Menu
            </button>
          </div>
        </div>
      </div>
  );
}
