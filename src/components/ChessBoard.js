// ChessBoard.js - ایجاد تخته شطرنج

import * as THREE from "three";
import { getCurrentChessTheme } from "../chessThemes";

const BOARD_SIZE = 8;
const SQUARE_SIZE = 10;
const BOARD_HEIGHT = 1;

/**
 * ایجاد تخته شطرنج
 * @param {Object} theme - تم تخته (اختیاری)
 * @returns {THREE.Group} گروه حاوی تخته شطرنج
 */
export function createChessBoard(theme = null) {
  const board = new THREE.Group();
  
  // استفاده از تم فعلی یا تم پیش‌فرض
  const currentTheme = theme || getCurrentChessTheme();
  
  // رنگ‌های تخته از تم
  const lightColor = currentTheme.lightSquare;
  const darkColor = currentTheme.darkSquare;
  const borderColor = currentTheme.border;

  // ایجاد مربع‌های تخته
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const isLight = (row + col) % 2 === 0;
      const color = isLight ? lightColor : darkColor;
      
      // ایجاد مربع (در صفحه XZ)
      const square = new THREE.Mesh(
        new THREE.BoxGeometry(SQUARE_SIZE, BOARD_HEIGHT, SQUARE_SIZE),
        new THREE.MeshLambertMaterial({ color, flatShading: true })
      );
      
      // محاسبه موقعیت (مرکز تخته در 0,0,0)
      // تخته در صفحه XZ قرار می‌گیرد (y=0) - استاندارد Three.js
      const offset = (BOARD_SIZE - 1) * SQUARE_SIZE / 2;
      square.position.set(
        col * SQUARE_SIZE - offset,
        0,
        row * SQUARE_SIZE - offset
      );
      
      square.receiveShadow = true;
      square.castShadow = true;
      
      // ذخیره اطلاعات مربع
      square.userData = {
        row,
        col,
        isLight,
        piece: null,
      };
      
      board.add(square);
    }
  }

  // اضافه کردن حاشیه تخته
  const borderThickness = 2;
  const borderHeight = BOARD_HEIGHT + 0.5;
  const boardWidth = BOARD_SIZE * SQUARE_SIZE;
  
  // حاشیه بالا (در راستای Z)
  const topBorder = new THREE.Mesh(
    new THREE.BoxGeometry(boardWidth + borderThickness * 2, borderHeight, borderThickness),
    new THREE.MeshLambertMaterial({ color: borderColor, flatShading: true })
  );
  topBorder.position.set(0, borderHeight / 2, boardWidth / 2 + borderThickness / 2);
  board.add(topBorder);

  // حاشیه پایین
  const bottomBorder = new THREE.Mesh(
    new THREE.BoxGeometry(boardWidth + borderThickness * 2, borderHeight, borderThickness),
    new THREE.MeshLambertMaterial({ color: borderColor, flatShading: true })
  );
  bottomBorder.position.set(0, borderHeight / 2, -boardWidth / 2 - borderThickness / 2);
  board.add(bottomBorder);

  // حاشیه چپ
  const leftBorder = new THREE.Mesh(
    new THREE.BoxGeometry(borderThickness, borderHeight, boardWidth),
    new THREE.MeshLambertMaterial({ color: borderColor, flatShading: true })
  );
  leftBorder.position.set(-boardWidth / 2 - borderThickness / 2, borderHeight / 2, 0);
  board.add(leftBorder);

  // حاشیه راست
  const rightBorder = new THREE.Mesh(
    new THREE.BoxGeometry(borderThickness, borderHeight, boardWidth),
    new THREE.MeshLambertMaterial({ color: borderColor, flatShading: true })
  );
  rightBorder.position.set(boardWidth / 2 + borderThickness / 2, borderHeight / 2, 0);
  board.add(rightBorder);
  
  // ذخیره تم در userData برای به‌روزرسانی بعدی
  board.userData.theme = currentTheme;

  return board;
}

/**
 * دریافت مربع در موقعیت مشخص
 */
export function getSquareAt(board, row, col) {
  return board.children.find(
    (child) => child.userData?.row === row && child.userData?.col === col
  );
}

/**
 * محاسبه موقعیت 3D از row و col
 */
export function getSquarePosition(row, col) {
  const offset = (BOARD_SIZE - 1) * SQUARE_SIZE / 2;
  return {
    x: col * SQUARE_SIZE - offset,
    y: BOARD_HEIGHT + 2, // کمی بالاتر از تخته
    z: row * SQUARE_SIZE - offset,
  };
}

/**
 * به‌روزرسانی تم تخته
 */
export function updateBoardTheme(board, theme) {
  if (!board || !theme) return;
  
  // به‌روزرسانی رنگ مربع‌ها
  const squares = board.children.filter(
    child => child.userData && child.userData.row !== undefined
  );
  
  squares.forEach(square => {
      if (square.userData) {
        const isLight = square.userData.isLight;
        const color = isLight ? theme.lightSquare : theme.darkSquare;
        
        if (square.material && square.material.color) {
          square.material.color.setHex(color);
        }
      }
  });
  
  // به‌روزرسانی رنگ حاشیه‌ها
  const borders = board.children.filter(
    child => !child.userData || child.userData.row === undefined
  );
  
  borders.forEach(border => {
    if (border.material && border.material.color) {
      border.material.color.setHex(theme.border);
    }
  });
  
  board.userData.theme = theme;
}

export { BOARD_SIZE, SQUARE_SIZE };

