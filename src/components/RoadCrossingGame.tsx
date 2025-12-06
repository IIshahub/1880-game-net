'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';
import { Renderer } from './Renderer';
import { Camera } from './Camera';
import { DirectionalLight } from './DirectionalLight';
import { player, initializePlayer } from './Player';
import { map, initializeMap } from './Map';
import { animateVehicles } from '../animateVehicles';
import { animatePlayer } from '../animatePlayer';
import { hitTest } from '../hitTest';
import { getAllThemes, setTheme, getCurrentThemeName } from '../themeManager';
import { updateSceneTheme } from '../themeUpdater';
import ThemeModal from './ThemeModal';
import CharacterModal from './CharacterModal';
import { useGameControls } from '../hooks/useGameControls';
import { setCharacter } from '../characterManager';
import { updatePlayerCharacter } from './Player';

export default function RoadCrossingGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showCharacterModal, setShowCharacterModal] = useState(false);
  const router = useRouter();
  
  useGameControls();

  useEffect(() => {
    if (!canvasRef.current) return;

    // ایجاد صحنه
    const scene = new THREE.Scene();
    scene.add(player);
    scene.add(map);
    sceneRef.current = scene;

    // تنظیم نور محیطی
    const ambientLight = new THREE.AmbientLight();
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    // تنظیم نور جهت‌دار
    const dirLight = DirectionalLight();
    dirLight.target = player;
    player.add(dirLight);
    dirLightRef.current = dirLight;

    // ایجاد و تنظیم دوربین
    const camera = Camera();
    player.add(camera);
    cameraRef.current = camera;

    // ایجاد رندرر
    const renderer = Renderer(canvasRef.current);
    rendererRef.current = renderer;

    // مقداردهی اولیه بازی
    initializeGame();

    // تنظیم حلقه انیمیشن
    function animate() {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;
      
      animateVehicles();
      animatePlayer();
      hitTest();
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      animationFrameRef.current = requestAnimationFrame(animate);
    }
    
    animate();

    // مدیریت تغییر اندازه پنجره
    const handleResize = () => {
      if (!rendererRef.current || !cameraRef.current) return;
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      if (sceneRef.current) {
        sceneRef.current.clear();
      }
    };
  }, []);

  const initializeGame = () => {
    initializePlayer();
    initializeMap();
    
    const scoreDOM = document.getElementById('score');
    const resultDOM = document.getElementById('result-container');
    if (scoreDOM) scoreDOM.innerText = '0';
    if (resultDOM) resultDOM.style.visibility = 'hidden';
  };

  const handleThemeChange = (themeName: string) => {
    setTheme(themeName);
    if (sceneRef.current && ambientLightRef.current && dirLightRef.current) {
      updateSceneTheme(
        sceneRef.current,
        map,
        player,
        ambientLightRef.current,
        dirLightRef.current
      );
    }
    initializeMap();
    setShowThemeModal(false);
  };

  const handleCharacterChange = (characterId: string) => {
    setCharacter(characterId);
    updatePlayerCharacter();
    setShowCharacterModal(false);
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

      <canvas ref={canvasRef} className="game" />
      
      <div id="controls">
        <div>
          <button id="forward">▲</button>
          <button id="left">◀</button>
          <button id="backward">▼</button>
          <button id="right">▶</button>
        </div>
      </div>
      
      <div id="score">0</div>
      
      <div id="result-container">
        <div id="result">
          <h1>Game Over</h1>
          <p>Your score: <span id="final-score"></span></p>
          <button id="retry" onClick={initializeGame}>Retry</button>
          <button onClick={() => router.push('/')} style={{ marginTop: '10px' }}>
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
}

