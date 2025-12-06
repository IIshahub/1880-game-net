// XOBoard.js - ایجاد تخته XO با Three.js

import * as THREE from "three";

const BOARD_SIZE = 3;
const CELL_SIZE = 10;
const BOARD_HEIGHT = 0.5;
const LINE_THICKNESS = 0.5;
const LINE_HEIGHT = 6;

/**
 * ایجاد تخته XO
 * @param {Object|null} theme - تم تخته (اختیاری)
 */
export function createXOBoard(theme) {
  const board = new THREE.Group();
  
  // استفاده از تم یا تم پیش‌فرض
  let boardColor, lineColor;
  if (theme && theme.boardColor && theme.lineColor) {
    boardColor = theme.boardColor;
    lineColor = theme.lineColor;
  } else {
    boardColor = 0x2c3e50; // آبی تیره
    lineColor = 0x34495e; // آبی تیره‌تر
  }
  
  // ایجاد صفحه اصلی
  const base = new THREE.Mesh(
    new THREE.BoxGeometry(CELL_SIZE * 3 + 2, BOARD_HEIGHT, CELL_SIZE * 3 + 2),
    new THREE.MeshLambertMaterial({ color: boardColor, flatShading: true })
  );
  base.position.y = -BOARD_HEIGHT / 2;
  base.receiveShadow = true;
  board.add(base);
  
  // محاسبه اندازه واقعی هر سلول (با در نظر گیری خطوط)
  const totalSize = CELL_SIZE * 3;
  const totalLineThickness = LINE_THICKNESS * 2; // دو خط (عمودی و افقی)
  const actualCellSize = (totalSize - totalLineThickness) / 3;
  const cellSpacing = actualCellSize + LINE_THICKNESS;
  
  // محاسبه offset برای مرکز کردن تخته
  const boardOffset = (totalSize - LINE_THICKNESS) / 2;
  
  // ایجاد خطوط عمودی
  for (let i = 1; i < BOARD_SIZE; i++) {
    const line = new THREE.Mesh(
      new THREE.BoxGeometry(LINE_THICKNESS, LINE_HEIGHT, totalSize),
      new THREE.MeshLambertMaterial({ color: lineColor, flatShading: true })
    );
    const linePosition = -boardOffset + i * cellSpacing;
    line.position.set(
      linePosition,
      LINE_HEIGHT / 2,
      0
    );
    line.castShadow = true;
    line.receiveShadow = true;
    board.add(line);
  }
  
  // ایجاد خطوط افقی
  for (let i = 1; i < BOARD_SIZE; i++) {
    const line = new THREE.Mesh(
      new THREE.BoxGeometry(totalSize, LINE_HEIGHT, LINE_THICKNESS),
      new THREE.MeshLambertMaterial({ color: lineColor, flatShading: true })
    );
    const linePosition = -boardOffset + i * cellSpacing;
    line.position.set(
      0,
      LINE_HEIGHT / 2,
      linePosition
    );
    line.castShadow = true;
    line.receiveShadow = true;
    board.add(line);
  }
  
  // ایجاد مربع‌های سلول‌ها (برای raycasting)
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const cell = new THREE.Mesh(
        new THREE.PlaneGeometry(actualCellSize, actualCellSize),
        new THREE.MeshBasicMaterial({ 
          color: 0x000000, 
          transparent: true, 
          opacity: 0,
          side: THREE.DoubleSide
        })
      );
      // محاسبه موقعیت مرکز هر سلول
      const cellCenterX = -boardOffset + col * cellSpacing + actualCellSize / 2;
      const cellCenterZ = -boardOffset + row * cellSpacing + actualCellSize / 2;
      
      cell.position.set(
        cellCenterX,
        LINE_HEIGHT + 0.1,
        cellCenterZ
      );
      cell.rotation.x = -Math.PI / 2;
      cell.userData = {
        row,
        col,
        value: null, // 'X' یا 'O' یا null
      };
      board.add(cell);
    }
  }
  
  return board;
}

/**
 * دریافت سلول در موقعیت مشخص
 */
export function getCellAt(board, row, col) {
  return board.children.find(
    child => child.userData && child.userData.row === row && child.userData.col === col
  );
}

/**
 * محاسبه موقعیت 3D از row و col
 */
export function getCellPosition(row, col) {
  const totalSize = CELL_SIZE * 3;
  const totalLineThickness = LINE_THICKNESS * 2;
  const actualCellSize = (totalSize - totalLineThickness) / 3;
  const cellSpacing = actualCellSize + LINE_THICKNESS;
  const boardOffset = (totalSize - LINE_THICKNESS) / 2;
  
  const cellCenterX = -boardOffset + col * cellSpacing + actualCellSize / 2;
  const cellCenterZ = -boardOffset + row * cellSpacing + actualCellSize / 2;
  
  return {
    x: cellCenterX,
    y: LINE_HEIGHT + 2,
    z: cellCenterZ,
  };
}

/**
 * به‌روزرسانی تم تخته
 */
export function updateBoardTheme(board, theme) {
  if (!board || !theme) return;
  
  // به‌روزرسانی رنگ صفحه اصلی
  const base = board.children.find(child => child.name === 'base' || (child.material && child.material.color));
  if (base && base.material && base.material.color) {
    base.material.color.setHex(theme.boardColor);
  } else {
    // اگر base پیدا نشد، اولین child که mesh است را پیدا کن
    board.children.forEach(child => {
      if (child instanceof THREE.Mesh && child.material && child.material.color && !child.userData) {
        // این احتمالاً base است
        child.material.color.setHex(theme.boardColor);
      }
    });
  }
  
  // به‌روزرسانی رنگ خطوط
  board.children.forEach(child => {
    if (child instanceof THREE.Mesh && child.material && child.material.color && child.userData && child.userData.row === undefined) {
      // این یک خط است (نه سلول)
      const geometry = child.geometry;
      // خطوط معمولاً ارتفاع بیشتری دارند
      if (geometry instanceof THREE.BoxGeometry) {
        const size = geometry.parameters;
        // خطوط عمودی یا افقی
        if ((size.width === LINE_THICKNESS && size.depth === CELL_SIZE * 3) || 
            (size.width === CELL_SIZE * 3 && size.depth === LINE_THICKNESS)) {
          child.material.color.setHex(theme.lineColor);
        }
      }
    }
  });
}

export { BOARD_SIZE, CELL_SIZE, LINE_HEIGHT };

