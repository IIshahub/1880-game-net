'use client';

import { useGSAP } from '@gsap/react';
import { Canvas } from '@react-three/fiber';
import gsap from 'gsap';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { setCharacter, getCurrentCharacterId } from '../characterManager';
import { GameControlsProvider } from '../road-crossing/GameContext';
import { MobileControls } from '../road-crossing/input/MobileControls';
import { useRoadCrossingInput } from '../road-crossing/input/useRoadCrossingInput';
import { ZoomControls } from '../road-crossing/input/ZoomControls';
import { getGameDpr } from '../road-crossing/mobilePerf';
import { prefersReducedMotion } from '../road-crossing/motion/playerHop';
import {
  CAMERA_ZOOM_DEFAULT,
  CHAIN_MAX_TILE_DISTANCE,
} from '../road-crossing/constants';
import {
  createLocalChainSession,
  createSoloSession,
  type SessionKind,
} from '../road-crossing/net/session';
import { RoadCrossingScene } from '../road-crossing/RoadCrossingScene';
import { pickHumiliatingLine } from '../road-crossing/humiliatingLines';
import { setTheme, getCurrentThemeName } from '../themeManager';
import CharacterModal from './CharacterModal';
import ThemeModal from './ThemeModal';

gsap.registerPlugin(useGSAP);

export default function RoadCrossingGame() {
  return (
    <GameControlsProvider>
      <RoadCrossingGameContent />
    </GameControlsProvider>
  );
}

function RoadCrossingGameContent() {
  const shellRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showCharacterModal, setShowCharacterModal] = useState(false);
  const [score, setScore] = useState(0);
  const [coinRun, setCoinRun] = useState({ coinsCollected: 0, coinPoints: 0 });
  const [scoreSaved, setScoreSaved] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [sceneKey, setSceneKey] = useState(0);
  const [themeKey, setThemeKey] = useState(getCurrentThemeName());
  const [characterKey, setCharacterKey] = useState(getCurrentCharacterId());
  const [sessionKind, setSessionKind] = useState<SessionKind>('solo');
  const [cameraZoom, setCameraZoom] = useState(CAMERA_ZOOM_DEFAULT);
  const [roast, setRoast] = useState('');
  const router = useRouter();
  const dpr = useMemo(() => getGameDpr(), [sceneKey]);
  const chainedMode = sessionKind === 'local-chain' || sessionKind === 'online-chain';

  useRoadCrossingInput({
    shellRef,
    enabled: !gameOver && !showThemeModal && !showCharacterModal,
    chainedMode,
  });

  const resetGame = useCallback(() => {
    setScore(0);
    setCoinRun({ coinsCollected: 0, coinPoints: 0 });
    setScoreSaved(null);
    setGameOver(false);
    setRoast('');
    setSceneKey((k) => k + 1);
  }, []);

  const submitRunScore = useCallback(
    async (finalScore: number, coins: { coinsCollected: number; coinPoints: number }) => {
      try {
        const res = await fetch('/api/scores/road-crossing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            score: finalScore,
            coinsCollected: coins.coinsCollected,
            coinPoints: coins.coinPoints,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setScoreSaved(data.error ?? 'Could not save score');
          return;
        }
        const parts: string[] = [];
        if (data.newBestScore) parts.push('New best score!');
        if (coins.coinPoints > 0) parts.push(`+${coins.coinPoints} coin points saved`);
        setScoreSaved(parts.length ? parts.join(' ') : 'Run saved to leaderboard');
      } catch {
        setScoreSaved('Could not reach server');
      }
    },
    [],
  );

  const setMode = (kind: SessionKind) => {
    if (kind === 'online-chain') {
      // Online rooms come later — keep UI honest
      window.alert('Online chain (2 devices) is coming soon. Use Chained 2P Local for now.');
      return;
    }
    setSessionKind(kind);
    kind === 'solo' ? createSoloSession() : createLocalChainSession();
    setScore(0);
    setCoinRun({ coinsCollected: 0, coinPoints: 0 });
    setScoreSaved(null);
    setGameOver(false);
    setSceneKey((k) => k + 1);
  };

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

  useGSAP(
    () => {
      const panel = resultRef.current;
      if (!panel || !gameOver) return;

      if (prefersReducedMotion()) {
        gsap.set(panel, { autoAlpha: 1, scale: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        panel,
        { autoAlpha: 0, scale: 0.85, y: 24 },
        { autoAlpha: 1, scale: 1, y: 0, duration: 0.45, ease: 'back.out(1.6)' },
      );
    },
    { dependencies: [gameOver], scope: shellRef },
  );

  return (
    <div className="game-screen rc-game-shell" ref={shellRef}>
      <button type="button" className="rc-back-btn" onClick={() => router.push('/')}>
        ← Back
      </button>

      <div className="rc-mode-toggle" role="group" aria-label="Play mode">
        <button
          type="button"
          className={sessionKind === 'solo' ? 'active' : ''}
          onClick={() => setMode('solo')}
        >
          Solo
        </button>
        <button
          type="button"
          className={sessionKind === 'local-chain' ? 'active' : ''}
          onClick={() => setMode('local-chain')}
        >
          Chained 2P
        </button>
        <button type="button" className="rc-mode-soon" onClick={() => setMode('online-chain')}>
          Online soon
        </button>
      </div>

      <button
        type="button"
        className="theme-open-button rc-hud-btn rc-hud-theme"
        onClick={() => setShowThemeModal(true)}
        aria-label="Themes"
      >
        🎨
      </button>
      <button
        type="button"
        className="theme-open-button rc-hud-btn rc-hud-character"
        onClick={() => setShowCharacterModal(true)}
        aria-label="Characters"
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
        dpr={dpr}
        gl={{ antialias: !dpr || dpr[1] > 1.25, powerPreference: 'high-performance' }}
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
          key={`${sceneKey}-${themeKey}-${sessionKind}`}
          characterKey={characterKey}
          chainedMode={chainedMode}
          cameraZoom={cameraZoom}
          onScoreChange={setScore}
          onCoinRunChange={setCoinRun}
          onGameOver={(finalScore, coins) => {
            setScore(finalScore);
            setCoinRun(coins);
            setRoast(pickHumiliatingLine());
            setGameOver(true);
            void submitRunScore(finalScore, coins);
          }}
          gameOver={gameOver}
        />
      </Canvas>

      <ZoomControls
        zoom={cameraZoom}
        onZoomChange={setCameraZoom}
        shellRef={shellRef}
        disabled={showThemeModal || showCharacterModal}
      />

      <MobileControls disabled={gameOver} player={0} label={chainedMode ? 'P1' : undefined} />
      {chainedMode && (
        <MobileControls disabled={gameOver} player={1} label="P2" className="rc-controls-p2" />
      )}

      <div id="score" className="rc-score">
        {score}
        {chainedMode ? <span className="rc-score-mode"> chained</span> : null}
      </div>
      <div className="rc-coins-hud" aria-live="polite">
        <span className="rc-coins-icon">🪙</span>
        <span>{coinRun.coinsCollected}</span>
        <span className="rc-coins-points">+{coinRun.coinPoints} pts</span>
      </div>

      {chainedMode && (
        <div className="rc-chain-hint">
          P1: arrows / right pad · P2: WASD / left pad · max {CHAIN_MAX_TILE_DISTANCE} tiles apart · hit player or chain = lose
        </div>
      )}

      <div
        id="result-container"
        className="rc-result-container"
        style={{ visibility: gameOver ? 'visible' : 'hidden', pointerEvents: gameOver ? 'auto' : 'none' }}
      >
        <div id="result" className="rc-result" ref={resultRef}>
          <h1>Game Over</h1>
          <p className="rc-roast">{roast}</p>
          <p>
            Score: <span id="final-score">{score}</span>
          </p>
          <p className="rc-run-coins">
            Coins: {coinRun.coinsCollected} · Coin points: {coinRun.coinPoints}
          </p>
          {scoreSaved ? <p className="rc-score-saved">{scoreSaved}</p> : null}
          <button type="button" id="retry" onClick={resetGame}>
            Retry
          </button>
          <button type="button" onClick={() => router.push('/')} style={{ marginTop: '10px' }}>
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
}
