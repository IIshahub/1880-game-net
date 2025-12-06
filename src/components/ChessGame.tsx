'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createChessBoard, getSquareAt, getSquarePosition, updateBoardTheme } from './ChessBoard';
import { createInitialPieces, updatePiecesStyle } from './ChessPieces';
import { getValidMoves, isKingInCheck, isCheckmate } from './ChessLogic';
import { setChessTheme, getCurrentChessTheme } from '../chessThemes';
import { setPieceStyle } from '../chessPieceStyles';
import ChessThemeModal from './ChessThemeModal';
import ChessPieceStyleModal from './ChessPieceStyleModal';

export default function ChessGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const boardRef = useRef<THREE.Group | null>(null);
  const piecesRef = useRef<THREE.Group | null>(null);
  const selectedPieceRef = useRef<THREE.Object3D | null>(null);
  const validMovesRef = useRef<THREE.Mesh[]>([]);
  const kingHighlightRef = useRef<THREE.Mesh | null>(null);
  const currentTurnRef = useRef<'white' | 'black'>('white');
  const [currentTurn, setCurrentTurn] = useState<'white' | 'black'>('white');
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showPieceStyleModal, setShowPieceStyleModal] = useState(false);
  const [checkStatus, setCheckStatus] = useState<{ inCheck: boolean; color: 'white' | 'black' | null }>({ inCheck: false, color: null });
  const [gameOver, setGameOver] = useState<{ isOver: boolean; winner: 'white' | 'black' | null }>({ isOver: false, winner: null });
  const router = useRouter();

  useEffect(() => {
    if (!canvasRef.current) return;

    // ایجاد صحنه
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x2c3e50);
    sceneRef.current = scene;

    // ایجاد دوربین (از بالا نگاه می‌کند)
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    // دوربین را عقب‌تر قرار می‌دهیم (y بیشتر = دورتر)
    camera.position.set(0, 100, 0); // از بالا و دورتر (y بیشتر)
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // اضافه کردن OrbitControls برای چرخش دوربین با موس
    const controls = new OrbitControls(camera, canvasRef.current);
    controls.enableDamping = true; // برای حرکت نرم
    controls.dampingFactor = 0.05;
    controls.minDistance = 50; // حداقل فاصله بیشتر
    controls.maxDistance = 150; // حداکثر فاصله بیشتر
    controls.maxPolarAngle = Math.PI / 2.2; // محدود کردن به نیمه بالایی (از بالا)
    controls.minPolarAngle = Math.PI / 6; // حداقل زاویه (حدود 30 درجه)
    controls.target.set(0, 0, 0);
    controls.enablePan = true; // اجازه جابجایی
    controls.enableZoom = true; // اجازه زوم
    
    // تنظیم mouse buttons برای جلوگیری از تداخل با click event
    // کلیک چپ برای انتخاب مهره است، drag چپ برای چرخش دوربین
    controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE, // چرخش با drag کلیک چپ
      MIDDLE: THREE.MOUSE.DOLLY, // زوم با scroll
      RIGHT: THREE.MOUSE.PAN // جابجایی با drag دکمه راست
    };
    
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

    // نور جهت‌دار (از بالا)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 50, 0);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.left = -50;
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.bottom = -50;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 100;
    scene.add(directionalLight);

    // ایجاد تخته شطرنج
    const board = createChessBoard();
    boardRef.current = board;
    scene.add(board);

    // ایجاد مهره‌ها
    const pieces = createInitialPieces(board);
    piecesRef.current = pieces;
    scene.add(pieces);
    
    // اطمینان از اینکه همه مهره‌ها قابل raycast هستند
    pieces.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.raycast = THREE.Mesh.prototype.raycast;
      }
    });
    
    console.log('Pieces created:', pieces.children.length, 'pieces');

    // حذف highlight های قبلی
    const clearHighlights = () => {
      validMovesRef.current.forEach(highlight => {
        if (highlight.parent) {
          highlight.parent.remove(highlight);
          highlight.geometry.dispose();
          (highlight.material as THREE.Material).dispose();
        }
      });
      validMovesRef.current = [];
    };
    
    // حذف highlight شاه
    const clearKingHighlight = () => {
      if (kingHighlightRef.current && kingHighlightRef.current.parent) {
        kingHighlightRef.current.parent.remove(kingHighlightRef.current);
        kingHighlightRef.current.geometry.dispose();
        (kingHighlightRef.current.material as THREE.Material).dispose();
        kingHighlightRef.current = null;
      }
    };
    
    // نمایش highlight شاه در کیش
    const highlightKingInCheck = (kingColor: 'white' | 'black') => {
      clearKingHighlight();
      
      if (!boardRef.current || !piecesRef.current) return;
      
      // پیدا کردن شاه
      let kingPiece: THREE.Object3D | null = null;
      piecesRef.current.children.forEach(piece => {
        if (piece.userData && piece.userData.type === 'king' && piece.userData.color === kingColor) {
          kingPiece = piece;
        }
      });
      
      if (kingPiece) {
        const kingPos = (kingPiece as THREE.Object3D).position;
        const highlight = new THREE.Mesh(
          new THREE.RingGeometry(4, 5.5, 32),
          new THREE.MeshBasicMaterial({ 
            color: 0xff0000, // قرمز برای کیش
            transparent: true, 
            opacity: 0.7,
            side: THREE.DoubleSide
          })
        );
        
        highlight.position.set(kingPos.x, kingPos.y + 0.1, kingPos.z);
        highlight.rotation.x = -Math.PI / 2;
        
        scene.add(highlight);
        kingHighlightRef.current = highlight;
      }
    };
    
    // بررسی کیش و کیش‌مات
    const checkGameStatus = () => {
      if (!boardRef.current) return;
      
      // بررسی کیش برای هر دو رنگ
      const whiteInCheck = isKingInCheck(boardRef.current, 'white');
      const blackInCheck = isKingInCheck(boardRef.current, 'black');
      
      if (whiteInCheck) {
        setCheckStatus({ inCheck: true, color: 'white' });
        highlightKingInCheck('white');
        
        if (isCheckmate(boardRef.current, 'white')) {
          setGameOver({ isOver: true, winner: 'black' });
        }
      } else if (blackInCheck) {
        setCheckStatus({ inCheck: true, color: 'black' });
        highlightKingInCheck('black');
        
        if (isCheckmate(boardRef.current, 'black')) {
          setGameOver({ isOver: true, winner: 'white' });
        }
      } else {
        setCheckStatus({ inCheck: false, color: null });
        clearKingHighlight();
      }
    };

    // نمایش حرکات مجاز
    const showValidMoves = (piece: THREE.Object3D) => {
      clearHighlights();
      
      if (!boardRef.current) return;
      
      const validMoves = getValidMoves(piece, boardRef.current);
      
      validMoves.forEach(move => {
        const highlight = new THREE.Mesh(
          new THREE.RingGeometry(3, 4.5, 32),
          new THREE.MeshBasicMaterial({ 
            color: 0x00ff00, 
            transparent: true, 
            opacity: 0.5,
            side: THREE.DoubleSide
          })
        );
        
        const position = getSquarePosition(move.row, move.col);
        highlight.position.set(position.x, position.y + 0.1, position.z);
        highlight.rotation.x = -Math.PI / 2; // چرخش به صورت افقی
        
        scene.add(highlight);
        validMovesRef.current.push(highlight);
      });
    };

    // جابجایی مهره
    const movePiece = (piece: THREE.Object3D, targetRow: number, targetCol: number) => {
      if (!boardRef.current || !piecesRef.current) return;
      
      const targetSquare = getSquareAt(boardRef.current, targetRow, targetCol);
      if (!targetSquare) return;
      
      // ذخیره وضعیت قبلی برای undo در صورت نیاز
      const oldRow = piece.userData.row;
      const oldCol = piece.userData.col;
      const oldSquare = getSquareAt(boardRef.current, oldRow, oldCol);
      const capturedPiece = targetSquare.userData.piece;
      
      // اگر مهره‌ای در خانه هدف است، آن را حذف کن
      if (capturedPiece) {
        piecesRef.current.remove(capturedPiece);
        // حذف geometry و material برای جلوگیری از memory leak
        capturedPiece.traverse((child: THREE.Object3D) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            if (Array.isArray(child.material)) {
              child.material.forEach(mat => mat.dispose());
            } else {
              child.material.dispose();
            }
          }
        });
      }
      
      // جابجایی مهره
      const position = getSquarePosition(targetRow, targetCol);
      piece.position.set(position.x, position.y, position.z);
      
      // به‌روزرسانی userData
      if (oldSquare) {
        oldSquare.userData.piece = null;
      }
      
      piece.userData.row = targetRow;
      piece.userData.col = targetCol;
      targetSquare.userData.piece = piece;
      
      // بررسی اینکه آیا این حرکت شاه خودی را در کیش قرار می‌دهد
      const pieceColor = piece.userData.color;
      const kingInCheck = isKingInCheck(boardRef.current, pieceColor);
      
      if (kingInCheck) {
        // این حرکت معتبر نیست، undo کن
        console.log('Invalid move: would put own king in check');
        
        // برگرداندن مهره
        const oldPosition = getSquarePosition(oldRow, oldCol);
        piece.position.set(oldPosition.x, oldPosition.y, oldPosition.z);
        piece.userData.row = oldRow;
        piece.userData.col = oldCol;
        
        if (oldSquare) {
          oldSquare.userData.piece = piece;
        }
        targetSquare.userData.piece = capturedPiece;
        
        // اگر مهره capture شده بود، آن را دوباره اضافه کن
        if (capturedPiece) {
          piecesRef.current.add(capturedPiece);
        }
        
        return; // حرکت انجام نشد
      }
      
      // تغییر نوبت
      const newTurn = currentTurnRef.current === 'white' ? 'black' : 'white';
      currentTurnRef.current = newTurn;
      setCurrentTurn(newTurn);
      
      // بررسی کیش و کیش‌مات بعد از حرکت
      setTimeout(() => {
        checkGameStatus();
      }, 100);
    };

    // مدیریت کلیک
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let mouseDownTime = 0;
    
    const handleMouseDown = (event: MouseEvent) => {
      // فقط کلیک چپ (button 0)
      if (event.button !== 0) return;
      
      isDragging = false;
      dragStartX = event.clientX;
      dragStartY = event.clientY;
      mouseDownTime = Date.now();
    };
    
    const handleMouseMove = (event: MouseEvent) => {
      if (event.buttons === 1) { // اگر دکمه چپ نگه داشته شده
        const deltaX = Math.abs(event.clientX - dragStartX);
        const deltaY = Math.abs(event.clientY - dragStartY);
        if (deltaX > 3 || deltaY > 3) { // اگر حرکت بیشتر از 3 پیکسل باشد
          isDragging = true;
        }
      }
    };
    
    const handleClick = (event: MouseEvent) => {
      // فقط کلیک چپ
      if (event.button !== 0) return;
      
      // اگر drag بوده یا زمان کلیک خیلی کوتاه نبوده (یعنی drag بوده)
      const clickDuration = Date.now() - mouseDownTime;
      if (isDragging || clickDuration > 200) {
        isDragging = false;
        return; // این یک drag است، نه کلیک
      }
      
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect || !cameraRef.current || !piecesRef.current || !boardRef.current) {
        console.log('Missing refs:', { canvas: !!canvasRef.current, camera: !!cameraRef.current, pieces: !!piecesRef.current, board: !!boardRef.current });
        return;
      }

      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, cameraRef.current);
      console.log('Click detected, mouse:', mouse);

      // اول بررسی کن که آیا روی مربع تخته کلیک شده (فقط مربع‌ها، نه border ها)
      const squares = boardRef.current.children.filter(
        child => child.userData && child.userData.row !== undefined
      );
      const boardIntersects = raycaster.intersectObjects(squares, true);
      console.log('Board intersects:', boardIntersects.length);
      
      if (boardIntersects.length > 0) {
        const clickedSquare = boardIntersects[0].object;
        if (clickedSquare.userData && clickedSquare.userData.row !== undefined) {
          const targetRow = clickedSquare.userData.row;
          const targetCol = clickedSquare.userData.col;
          console.log('Clicked on square:', targetRow, targetCol, 'Selected piece:', !!selectedPieceRef.current);
          
          // اگر مهره‌ای انتخاب شده است
          if (selectedPieceRef.current) {
            console.log('Selected piece data:', {
              type: selectedPieceRef.current.userData?.type,
              color: selectedPieceRef.current.userData?.color,
              row: selectedPieceRef.current.userData?.row,
              col: selectedPieceRef.current.userData?.col
            });
            
            const validMoves = getValidMoves(selectedPieceRef.current, boardRef.current);
            console.log('Valid moves for selected piece:', validMoves);
            console.log('Target square:', targetRow, targetCol);
            
            const isValidMove = validMoves.some(
              move => move.row === targetRow && move.col === targetCol
            );
            
            if (isValidMove) {
              console.log('Moving piece to:', targetRow, targetCol);
              // جابجایی مهره
              movePiece(selectedPieceRef.current, targetRow, targetCol);
              selectedPieceRef.current.scale.set(1, 1, 1);
              selectedPieceRef.current = null;
              clearHighlights();
              return;
            } else {
              console.log('Invalid move - move not in valid moves list');
            }
          }
        }
      }

      // بررسی برخورد با مهره‌ها
      const intersects = raycaster.intersectObjects(piecesRef.current.children, true);
      console.log('Piece intersects:', intersects.length);
      
      if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        let piece = clickedObject;
        
        // پیدا کردن مهره والد
        while (piece.parent && piece.parent !== piecesRef.current) {
          piece = piece.parent;
        }
        
        console.log('Found piece:', piece.userData?.type, piece.userData?.color);
        
        if (piece.userData && piece.userData.type) {
          // بررسی نوبت
          if (piece.userData.color !== currentTurnRef.current) {
            console.log('Not your turn. Current turn:', currentTurnRef.current, 'Piece color:', piece.userData.color);
            return; // نوبت این مهره نیست
          }
          
          // اگر همان مهره انتخاب شده است، از انتخاب خارج کن
          if (selectedPieceRef.current === piece) {
            console.log('Deselecting piece');
            piece.scale.set(1, 1, 1);
            selectedPieceRef.current = null;
            clearHighlights();
            return;
          }
          
          // اگر مهره‌ای دیگر انتخاب شده بود، آن را از حالت انتخاب خارج کن
          if (selectedPieceRef.current) {
            selectedPieceRef.current.scale.set(1, 1, 1);
          }
          
          // انتخاب مهره جدید
          console.log('Selecting piece:', piece.userData.type);
          selectedPieceRef.current = piece;
          piece.scale.set(1.2, 1.2, 1.2);
          showValidMoves(piece);
        }
      } else {
        // اگر روی فضای خالی کلیک شد
        if (selectedPieceRef.current) {
          console.log('Deselecting piece (clicked empty space)');
          selectedPieceRef.current.scale.set(1, 1, 1);
          selectedPieceRef.current = null;
          clearHighlights();
        }
      }
    };

    // اضافه کردن event listeners
    canvasRef.current.addEventListener('mousedown', handleMouseDown);
    canvasRef.current.addEventListener('mousemove', handleMouseMove);
    canvasRef.current.addEventListener('click', handleClick);

    // انیمیشن
    function animate() {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;
      
      // به‌روزرسانی controls
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
      canvasRef.current?.removeEventListener('mousedown', handleMouseDown);
      canvasRef.current?.removeEventListener('mousemove', handleMouseMove);
      canvasRef.current?.removeEventListener('click', handleClick);
      clearHighlights();
      clearKingHighlight();
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
  }, []);

  return (
    <div className="game-screen">
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
          backgroundColor: '#8b4513',
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
        onClick={() => setShowPieceStyleModal(true)}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
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
          whiteSpace: 'nowrap',
        }}
      >
        ♟️ Piece Style
      </button>
      
      <canvas ref={canvasRef} className="game" />
      
      <ChessThemeModal
        isOpen={showThemeModal}
        onClose={() => setShowThemeModal(false)}
        onThemeChange={(themeId) => {
          const newTheme = setChessTheme(themeId);
          if (boardRef.current) {
            updateBoardTheme(boardRef.current, newTheme);
          }
        }}
      />
      
      <ChessPieceStyleModal
        isOpen={showPieceStyleModal}
        onClose={() => setShowPieceStyleModal(false)}
        onStyleChange={(styleId) => {
          const newStyle = setPieceStyle(styleId);
          if (piecesRef.current) {
            updatePiecesStyle(piecesRef.current, newStyle);
          }
        }}
      />
      
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '15px 30px',
        borderRadius: '15px',
        fontSize: '14px',
        zIndex: 1000,
        textAlign: 'center',
      }}>
        <div>Click on a piece to select it • Click on highlighted squares to move</div>
        <div style={{ fontSize: '12px', marginTop: '5px', opacity: 0.8 }}>
          Drag mouse to rotate camera • Scroll to zoom • Current turn: <strong>{currentTurn}</strong>
          {checkStatus.inCheck && (
            <span style={{ color: '#ff0000', fontWeight: 'bold', marginLeft: '10px' }}>
              ⚠️ CHECK! {checkStatus.color} king is in danger!
            </span>
          )}
          {gameOver.isOver && (
            <span style={{ color: '#00ff00', fontWeight: 'bold', marginLeft: '10px' }}>
              🏆 CHECKMATE! {gameOver.winner} wins!
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

