'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createXOBoard, getCellAt, getCellPosition, updateBoardTheme } from './XOBoard';
import { createX, createO } from './XOPieces';
import { setXOTheme, getCurrentXOTheme } from '../xoThemes';
import XOThemeModal from './XOThemeModal';

export default function XOGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const boardRef = useRef<THREE.Group | null>(null);
  const piecesRef = useRef<THREE.Group | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [gameBoard, setGameBoard] = useState<(string | null)[][]>(
    Array(3).fill(null).map(() => Array(3).fill(null))
  );
  const [gameOver, setGameOver] = useState<{ isOver: boolean; winner: 'X' | 'O' | 'draw' | null }>({
    isOver: false,
    winner: null
  });
  const currentPlayerRef = useRef<'X' | 'O'>('X');
  const gameBoardRef = useRef<(string | null)[][]>(
    Array(3).fill(null).map(() => Array(3).fill(null))
  );
  const gameOverRef = useRef<{ isOver: boolean; winner: 'X' | 'O' | 'draw' | null }>({
    isOver: false,
    winner: null
  });
  const [showThemeModal, setShowThemeModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!canvasRef.current) return;

    // ایجاد صحنه
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    sceneRef.current = scene;

    // ایجاد دوربین
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 25, 25);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // اضافه کردن OrbitControls
    const controls = new OrbitControls(camera, canvasRef.current);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 20;
    controls.maxDistance = 50;
    controls.target.set(0, 0, 0);
    controls.update();
    controlsRef.current = controls;

    // ایجاد رندرر
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // نور محیطی
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // نور جهت‌دار
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.left = -20;
    directionalLight.shadow.camera.right = 20;
    directionalLight.shadow.camera.top = 20;
    directionalLight.shadow.camera.bottom = -20;
    scene.add(directionalLight);

    // نور نقطه‌ای اضافی برای زیبایی
    const pointLight = new THREE.PointLight(0x3498db, 0.5, 50);
    pointLight.position.set(-15, 15, -15);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0xe74c3c, 0.5, 50);
    pointLight2.position.set(15, 15, 15);
    scene.add(pointLight2);

    // ایجاد تخته با تم فعلی
    const currentTheme = getCurrentXOTheme();
    const board = createXOBoard(currentTheme);
    boardRef.current = board;
    scene.add(board);

    // ایجاد گروه برای مهره‌ها
    const pieces = new THREE.Group();
    piecesRef.current = pieces;
    scene.add(pieces);

    // بررسی برنده
    const checkWinner = (board: (string | null)[][]) => {
      // بررسی ردیف‌ها
      for (let row = 0; row < 3; row++) {
        if (board[row][0] && board[row][0] === board[row][1] && board[row][1] === board[row][2]) {
          return board[row][0];
        }
      }

      // بررسی ستون‌ها
      for (let col = 0; col < 3; col++) {
        if (board[0][col] && board[0][col] === board[1][col] && board[1][col] === board[2][col]) {
          return board[0][col];
        }
      }

      // بررسی قطر اصلی
      if (board[0][0] && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
        return board[0][0];
      }

      // بررسی قطر فرعی
      if (board[0][2] && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
        return board[0][2];
      }

      return null;
    };

    // بررسی تساوی
    const checkDraw = (board: (string | null)[][]) => {
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          if (!board[row][col]) {
            return false;
          }
        }
      }
      return true;
    };

    // مدیریت کلیک
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (event: MouseEvent) => {
      if (gameOverRef.current.isOver) return;

      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect || !cameraRef.current || !boardRef.current) return;

      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, cameraRef.current);

      // پیدا کردن سلول‌ها
      const cells = boardRef.current.children.filter(
        child => child.userData && child.userData.row !== undefined
      );
      
      const intersects = raycaster.intersectObjects(cells, true);
      
      if (intersects.length > 0) {
        const clickedCell = intersects[0].object;
        const row = clickedCell.userData.row;
        const col = clickedCell.userData.col;
        
        // بررسی اینکه سلول خالی است
        if (gameBoardRef.current[row][col] !== null) {
          return; // سلول قبلاً پر شده
        }
        
        // ایجاد مهره
        let piece: THREE.Group;
        if (currentPlayerRef.current === 'X') {
          piece = createX(row, col);
        } else {
          piece = createO(row, col);
        }
        
        // انیمیشن ظاهر شدن
        piece.scale.set(0, 0, 0);
        pieces.add(piece);
        
        // انیمیشن scale
        const startTime = Date.now();
        const animateScale = () => {
          const elapsed = Date.now() - startTime;
          const duration = 300;
          const progress = Math.min(elapsed / duration, 1);
          
          // Easing function (ease out bounce)
          const easeOutBounce = (t: number) => {
            if (t < 1 / 2.75) {
              return 7.5625 * t * t;
            } else if (t < 2 / 2.75) {
              return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
            } else if (t < 2.5 / 2.75) {
              return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
            } else {
              return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
            }
          };
          
          const scale = easeOutBounce(progress);
          piece.scale.set(scale, scale, scale);
          
          if (progress < 1) {
            requestAnimationFrame(animateScale);
          }
        };
        animateScale();
        
        // به‌روزرسانی board state
        const newBoard = gameBoardRef.current.map((r, rIdx) =>
          r.map((c, cIdx) => (rIdx === row && cIdx === col ? currentPlayerRef.current : c))
        );
        gameBoardRef.current = newBoard;
        setGameBoard([...newBoard]);
        
        // بررسی برنده
        const winner = checkWinner(newBoard);
        if (winner) {
          const gameOverState = { isOver: true, winner: winner as 'X' | 'O' };
          gameOverRef.current = gameOverState;
          setGameOver(gameOverState);
          return;
        }
        
        // بررسی تساوی
        if (checkDraw(newBoard)) {
          const gameOverState = { isOver: true, winner: 'draw' as const };
          gameOverRef.current = gameOverState;
          setGameOver(gameOverState);
          return;
        }
        
        // تغییر نوبت
        const nextPlayer = currentPlayerRef.current === 'X' ? 'O' : 'X';
        currentPlayerRef.current = nextPlayer;
        setCurrentPlayer(nextPlayer);
      }
    };

    canvasRef.current.addEventListener('click', handleClick);

    // انیمیشن
    function animate() {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;
      
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      animationFrameRef.current = requestAnimationFrame(animate);
    }
    
    animate();

    // مدیریت تغییر اندازه پنجره
    const handleResize = () => {
      if (!rendererRef.current || !cameraRef.current) return;
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', handleResize);
      canvasRef.current?.removeEventListener('click', handleClick);
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      if (sceneRef.current) {
        sceneRef.current.clear();
      }
    };
  }, []); // فقط یک بار اجرا می‌شود

  // تابع تغییر تم
  const handleThemeChange = (themeId: string) => {
    setXOTheme(themeId);
    const newTheme = getCurrentXOTheme();
    if (boardRef.current) {
      updateBoardTheme(boardRef.current, newTheme);
    }
    setShowThemeModal(false);
  };

  // تابع reset بازی
  const resetGame = () => {
    const emptyBoard = Array(3).fill(null).map(() => Array(3).fill(null));
    gameBoardRef.current = emptyBoard;
    currentPlayerRef.current = 'X';
    gameOverRef.current = { isOver: false, winner: null };
    setGameBoard(emptyBoard);
    setCurrentPlayer('X');
    setGameOver({ isOver: false, winner: null });
    
    // حذف همه مهره‌ها
    if (piecesRef.current) {
      const children = [...piecesRef.current.children];
      children.forEach(piece => {
        piecesRef.current?.remove(piece);
        piece.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            if (Array.isArray(child.material)) {
              child.material.forEach(mat => mat.dispose());
            } else {
              child.material.dispose();
            }
          }
        });
      });
    }
  };

  return (
    <div className="game-screen" style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <button
        onClick={() => router.push('/')}
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          zIndex: 1001,
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
        onClick={() => setShowThemeModal(true)}
        style={{
          position: 'fixed',
          top: '20px',
          right: '180px',
          zIndex: 1001,
          padding: '10px 20px',
          backgroundColor: '#9b59b6',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold',
          boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
          whiteSpace: 'nowrap',
        }}
      >
        🎨 Board Theme
      </button>
      
      <button
        onClick={resetGame}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 1001,
          padding: '10px 20px',
          backgroundColor: '#27ae60',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold',
          boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
        }}
      >
        🔄 Reset
      </button>
      
      <XOThemeModal
        isOpen={showThemeModal}
        onClose={() => setShowThemeModal(false)}
        onThemeChange={handleThemeChange}
      />
      
      <canvas 
        ref={canvasRef} 
        className="game" 
        style={{ 
          display: 'block', 
          width: '100%', 
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0
        }} 
      />
      
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '20px 40px',
        borderRadius: '20px',
        fontSize: '18px',
        zIndex: 1000,
        textAlign: 'center',
        minWidth: '300px',
        boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
      }}>
        {!gameOver.isOver ? (
          <>
            <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>
              Current Player: <span style={{ 
                color: currentPlayer === 'X' ? '#e74c3c' : '#3498db',
                fontSize: '32px'
              }}>{currentPlayer}</span>
            </div>
            <div style={{ fontSize: '14px', opacity: 0.8, marginTop: '5px' }}>
              Click on a cell to place your mark
            </div>
          </>
        ) : (
          <>
            {gameOver.winner === 'draw' ? (
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f39c12' }}>
                🤝 It's a Draw!
              </div>
            ) : (
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                🎉 Winner: <span style={{ 
                  color: gameOver.winner === 'X' ? '#e74c3c' : '#3498db',
                  fontSize: '32px'
                }}>{gameOver.winner}</span>
              </div>
            )}
            <button
              onClick={resetGame}
              style={{
                marginTop: '15px',
                padding: '10px 30px',
                backgroundColor: '#27ae60',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
              }}
            >
              Play Again
            </button>
          </>
        )}
        <div style={{ fontSize: '12px', marginTop: '10px', opacity: 0.7 }}>
          Drag mouse to rotate camera • Scroll to zoom
        </div>
      </div>
    </div>
  );
}

