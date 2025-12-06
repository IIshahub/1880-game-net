// ChessPieces.js - ایجاد مهره‌های شطرنج

import * as THREE from "three";
import { getSquarePosition } from "./ChessBoard";
import { getCurrentPieceStyle } from "../chessPieceStyles";

const PIECE_HEIGHT = 4;
const PIECE_RADIUS = 3.5;
const BASE_HEIGHT = 0.5;

/**
 * دریافت رنگ مهره از استایل
 */
function getPieceColor(isWhite, style = null) {
  const currentStyle = style || getCurrentPieceStyle();
  return isWhite ? currentStyle.whiteColor : currentStyle.blackColor;
}

/**
 * دریافت رنگ تاج از استایل
 */
function getCrownColor(style = null) {
  const currentStyle = style || getCurrentPieceStyle();
  return currentStyle.crownColor;
}

/**
 * ایجاد پایه مهره
 */
function createPieceBase(color) {
  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(PIECE_RADIUS, PIECE_RADIUS, BASE_HEIGHT, 16),
    new THREE.MeshLambertMaterial({ color, flatShading: true })
  );
  base.position.y = BASE_HEIGHT / 2;
  base.castShadow = true;
  base.receiveShadow = true;
  return base;
}

/**
 * ایجاد شاه
 */
export function createKing(color, isWhite, style = null) {
  const piece = new THREE.Group();
  const currentStyle = style || getCurrentPieceStyle();
  const pieceColor = isWhite ? currentStyle.whiteColor : currentStyle.blackColor;
  const crownColor = currentStyle.crownColor;
  
  // پایه
  const base = createPieceBase(pieceColor);
  piece.add(base);
  
  // بدنه اصلی
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(PIECE_RADIUS * 0.7, PIECE_RADIUS * 0.8, PIECE_HEIGHT * 0.6, 16),
    new THREE.MeshLambertMaterial({ color: pieceColor, flatShading: true })
  );
  body.position.y = BASE_HEIGHT + PIECE_HEIGHT * 0.3;
  body.castShadow = true;
  piece.add(body);
  
  // تاج
  const crown = new THREE.Mesh(
    new THREE.CylinderGeometry(PIECE_RADIUS * 0.5, PIECE_RADIUS * 0.6, PIECE_HEIGHT * 0.3, 8),
    new THREE.MeshLambertMaterial({ color: pieceColor, flatShading: true })
  );
  crown.position.y = BASE_HEIGHT + PIECE_HEIGHT * 0.75;
  crown.castShadow = true;
  piece.add(crown);
  
  // صلیب روی تاج
  const cross = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, PIECE_HEIGHT * 0.4, 0.5),
    new THREE.MeshLambertMaterial({ color: crownColor, flatShading: true })
  );
  cross.position.y = BASE_HEIGHT + PIECE_HEIGHT * 0.9;
  cross.castShadow = true;
  piece.add(cross);
  
  piece.userData = { type: "king", color, isWhite, style: currentStyle.id };
  return piece;
}

/**
 * ایجاد وزیر
 */
export function createQueen(color, isWhite, style = null) {
  const piece = new THREE.Group();
  const pieceColor = getPieceColor(isWhite, style);
  const crownColor = getCrownColor(style);
  
  const base = createPieceBase(pieceColor);
  piece.add(base);
  
  // بدنه
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(PIECE_RADIUS * 0.7, PIECE_RADIUS * 0.8, PIECE_HEIGHT * 0.5, 16),
    new THREE.MeshLambertMaterial({ color: pieceColor, flatShading: true })
  );
  body.position.y = BASE_HEIGHT + PIECE_HEIGHT * 0.25;
  body.castShadow = true;
  piece.add(body);
  
  // تاج با نقاط
  const crownBase = new THREE.Mesh(
    new THREE.CylinderGeometry(PIECE_RADIUS * 0.5, PIECE_RADIUS * 0.6, PIECE_HEIGHT * 0.2, 8),
    new THREE.MeshLambertMaterial({ color: pieceColor, flatShading: true })
  );
  crownBase.position.y = BASE_HEIGHT + PIECE_HEIGHT * 0.6;
  crownBase.castShadow = true;
  piece.add(crownBase);
  
  // نقاط تاج
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.4, 8, 8),
      new THREE.MeshLambertMaterial({ color: crownColor, flatShading: true })
    );
    sphere.position.set(
      Math.cos(angle) * PIECE_RADIUS * 0.5,
      BASE_HEIGHT + PIECE_HEIGHT * 0.75,
      Math.sin(angle) * PIECE_RADIUS * 0.5
    );
    sphere.castShadow = true;
    piece.add(sphere);
  }
  
  const currentStyle = style || getCurrentPieceStyle();
  piece.userData = { type: "queen", color, isWhite, style: currentStyle.id };
  return piece;
}

/**
 * ایجاد قلعه
 */
export function createRook(color, isWhite, style = null) {
  const piece = new THREE.Group();
  const pieceColor = getPieceColor(isWhite, style);
  
  const base = createPieceBase(pieceColor);
  piece.add(base);
  
  // بدنه
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(PIECE_RADIUS * 1.2, PIECE_HEIGHT * 0.7, PIECE_RADIUS * 1.2),
    new THREE.MeshLambertMaterial({ color: pieceColor, flatShading: true })
  );
  body.position.y = BASE_HEIGHT + PIECE_HEIGHT * 0.35;
  body.castShadow = true;
  piece.add(body);
  
  // دیوارهای قلعه
  const wallHeight = PIECE_HEIGHT * 0.3;
  const wallThickness = 0.8;
  
  // دیوار جلو
  const frontWall = new THREE.Mesh(
    new THREE.BoxGeometry(PIECE_RADIUS * 1.2, wallHeight, wallThickness),
    new THREE.MeshLambertMaterial({ color: pieceColor, flatShading: true })
  );
  frontWall.position.set(0, BASE_HEIGHT + PIECE_HEIGHT * 0.85, PIECE_RADIUS * 0.6);
  frontWall.castShadow = true;
  piece.add(frontWall);
  
  // دیوار عقب
  const backWall = new THREE.Mesh(
    new THREE.BoxGeometry(PIECE_RADIUS * 1.2, wallHeight, wallThickness),
    new THREE.MeshLambertMaterial({ color: pieceColor, flatShading: true })
  );
  backWall.position.set(0, BASE_HEIGHT + PIECE_HEIGHT * 0.85, -PIECE_RADIUS * 0.6);
  backWall.castShadow = true;
  piece.add(backWall);
  
  // دیوار چپ
  const leftWall = new THREE.Mesh(
    new THREE.BoxGeometry(wallThickness, wallHeight, PIECE_RADIUS * 1.2),
    new THREE.MeshLambertMaterial({ color: pieceColor, flatShading: true })
  );
  leftWall.position.set(-PIECE_RADIUS * 0.6, BASE_HEIGHT + PIECE_HEIGHT * 0.85, 0);
  leftWall.castShadow = true;
  piece.add(leftWall);
  
  // دیوار راست
  const rightWall = new THREE.Mesh(
    new THREE.BoxGeometry(wallThickness, wallHeight, PIECE_RADIUS * 1.2),
    new THREE.MeshLambertMaterial({ color: pieceColor, flatShading: true })
  );
  rightWall.position.set(PIECE_RADIUS * 0.6, BASE_HEIGHT + PIECE_HEIGHT * 0.85, 0);
  rightWall.castShadow = true;
  piece.add(rightWall);
  
  const currentStyle = style || getCurrentPieceStyle();
  piece.userData = { type: "rook", color, isWhite, style: currentStyle.id };
  return piece;
}

/**
 * ایجاد فیل
 */
export function createBishop(color, isWhite, style = null) {
  const piece = new THREE.Group();
  const pieceColor = getPieceColor(isWhite, style);
  
  const base = createPieceBase(pieceColor);
  piece.add(base);
  
  // بدنه مخروطی
  const body = new THREE.Mesh(
    new THREE.ConeGeometry(PIECE_RADIUS * 0.6, PIECE_HEIGHT * 0.7, 16),
    new THREE.MeshLambertMaterial({ color: pieceColor, flatShading: true })
  );
  body.position.y = BASE_HEIGHT + PIECE_HEIGHT * 0.35;
  body.castShadow = true;
  piece.add(body);
  
  // برش بالای فیل
  const cut = new THREE.Mesh(
    new THREE.CylinderGeometry(PIECE_RADIUS * 0.3, PIECE_RADIUS * 0.3, PIECE_HEIGHT * 0.2, 8),
    new THREE.MeshLambertMaterial({ color: pieceColor, flatShading: true })
  );
  cut.position.y = BASE_HEIGHT + PIECE_HEIGHT * 0.9;
  cut.castShadow = true;
  piece.add(cut);
  
  const currentStyle = style || getCurrentPieceStyle();
  piece.userData = { type: "bishop", color, isWhite, style: currentStyle.id };
  return piece;
}

/**
 * ایجاد اسب
 */
export function createKnight(color, isWhite, style = null) {
  const piece = new THREE.Group();
  const pieceColor = getPieceColor(isWhite, style);
  
  const base = createPieceBase(pieceColor);
  piece.add(base);
  
  // بدنه
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(PIECE_RADIUS * 1.0, PIECE_HEIGHT * 0.5, PIECE_RADIUS * 0.8),
    new THREE.MeshLambertMaterial({ color: pieceColor, flatShading: true })
  );
  body.position.y = BASE_HEIGHT + PIECE_HEIGHT * 0.25;
  body.castShadow = true;
  piece.add(body);
  
  // سر اسب (ساده)
  const head = new THREE.Mesh(
    new THREE.BoxGeometry(PIECE_RADIUS * 0.6, PIECE_HEIGHT * 0.4, PIECE_RADIUS * 0.5),
    new THREE.MeshLambertMaterial({ color: pieceColor, flatShading: true })
  );
  head.position.set(PIECE_RADIUS * 0.3, BASE_HEIGHT + PIECE_HEIGHT * 0.7, 0);
  head.rotation.z = -0.3;
  head.castShadow = true;
  piece.add(head);
  
  const currentStyle = style || getCurrentPieceStyle();
  piece.userData = { type: "knight", color, isWhite, style: currentStyle.id };
  return piece;
}

/**
 * ایجاد سرباز
 */
export function createPawn(color, isWhite, style = null) {
  const piece = new THREE.Group();
  const pieceColor = getPieceColor(isWhite, style);
  
  const base = createPieceBase(pieceColor);
  piece.add(base);
  
  // بدنه
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(PIECE_RADIUS * 0.5, PIECE_RADIUS * 0.6, PIECE_HEIGHT * 0.6, 16),
    new THREE.MeshLambertMaterial({ color: pieceColor, flatShading: true })
  );
  body.position.y = BASE_HEIGHT + PIECE_HEIGHT * 0.3;
  body.castShadow = true;
  piece.add(body);
  
  // سر
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(PIECE_RADIUS * 0.4, 16, 16),
    new THREE.MeshLambertMaterial({ color: pieceColor, flatShading: true })
  );
  head.position.y = BASE_HEIGHT + PIECE_HEIGHT * 0.8;
  head.castShadow = true;
  piece.add(head);
  
  const currentStyle = style || getCurrentPieceStyle();
  piece.userData = { type: "pawn", color, isWhite, style: currentStyle.id };
  return piece;
}

/**
 * قرار دادن مهره روی تخته
 */
export function placePiece(piece, row, col, board) {
  const position = getSquarePosition(row, col);
  piece.position.set(position.x, position.y, position.z);
  
  // ذخیره موقعیت در userData
  piece.userData.row = row;
  piece.userData.col = col;
  
  // ذخیره reference در مربع
  const square = board.children.find(
    (child) => child.userData?.row === row && child.userData?.col === col
  );
  if (square) {
    square.userData.piece = piece;
  }
  
  return piece;
}

/**
 * ایجاد تمام مهره‌های اولیه
 */
export function createInitialPieces(board) {
  const pieces = new THREE.Group();
  
  // مهره‌های سفید
  const whitePieces = [
    { type: "rook", row: 0, col: 0 },
    { type: "knight", row: 0, col: 1 },
    { type: "bishop", row: 0, col: 2 },
    { type: "queen", row: 0, col: 3 },
    { type: "king", row: 0, col: 4 },
    { type: "bishop", row: 0, col: 5 },
    { type: "knight", row: 0, col: 6 },
    { type: "rook", row: 0, col: 7 },
  ];
  
  // سربازهای سفید
  for (let col = 0; col < 8; col++) {
    whitePieces.push({ type: "pawn", row: 1, col });
  }
  
  // مهره‌های سیاه
  const blackPieces = [
    { type: "rook", row: 7, col: 0 },
    { type: "knight", row: 7, col: 1 },
    { type: "bishop", row: 7, col: 2 },
    { type: "queen", row: 7, col: 3 },
    { type: "king", row: 7, col: 4 },
    { type: "bishop", row: 7, col: 5 },
    { type: "knight", row: 7, col: 6 },
    { type: "rook", row: 7, col: 7 },
  ];
  
  // سربازهای سیاه
  for (let col = 0; col < 8; col++) {
    blackPieces.push({ type: "pawn", row: 6, col });
  }
  
  // ایجاد و قرار دادن مهره‌های سفید
  whitePieces.forEach(({ type, row, col }) => {
    let piece;
    const isWhite = true;
    
    switch (type) {
      case "king":
        piece = createKing("white", isWhite);
        break;
      case "queen":
        piece = createQueen("white", isWhite);
        break;
      case "rook":
        piece = createRook("white", isWhite);
        break;
      case "bishop":
        piece = createBishop("white", isWhite);
        break;
      case "knight":
        piece = createKnight("white", isWhite);
        break;
      case "pawn":
        piece = createPawn("white", isWhite);
        break;
    }
    
    placePiece(piece, row, col, board);
    pieces.add(piece);
  });
  
  // ایجاد و قرار دادن مهره‌های سیاه
  blackPieces.forEach(({ type, row, col }) => {
    let piece;
    const isWhite = false;
    
    switch (type) {
      case "king":
        piece = createKing("black", isWhite);
        break;
      case "queen":
        piece = createQueen("black", isWhite);
        break;
      case "rook":
        piece = createRook("black", isWhite);
        break;
      case "bishop":
        piece = createBishop("black", isWhite);
        break;
      case "knight":
        piece = createKnight("black", isWhite);
        break;
      case "pawn":
        piece = createPawn("black", isWhite);
        break;
    }
    
    placePiece(piece, row, col, board);
    pieces.add(piece);
  });
  
  return pieces;
}

/**
 * به‌روزرسانی رنگ مهره‌ها با استایل جدید
 */
export function updatePiecesStyle(pieces, style) {
  if (!pieces || !style) return;
  
  pieces.children.forEach(piece => {
    if (!piece.userData || !piece.userData.type) return;
    
    const isWhite = piece.userData.isWhite;
    const pieceColor = isWhite ? style.whiteColor : style.blackColor;
    const crownColor = style.crownColor;
    
    // به‌روزرسانی رنگ همه mesh ها در این مهره
    piece.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material && child.material.color) {
        // برای king: cross باید crownColor باشد
        if (piece.userData.type === 'king') {
          const isCross = child.position.y > BASE_HEIGHT + PIECE_HEIGHT * 0.85;
          if (isCross) {
            child.material.color.setHex(crownColor);
          } else {
            child.material.color.setHex(pieceColor);
          }
        }
        // برای queen: نقاط تاج (sphere) باید crownColor باشد
        else if (piece.userData.type === 'queen') {
          const isCrownPoint = child.geometry instanceof THREE.SphereGeometry;
          if (isCrownPoint) {
            child.material.color.setHex(crownColor);
          } else {
            child.material.color.setHex(pieceColor);
          }
        }
        // برای بقیه مهره‌ها: همه pieceColor
        else {
          child.material.color.setHex(pieceColor);
        }
      }
    });
    
    // به‌روزرسانی userData
    piece.userData.style = style.id;
  });
}

