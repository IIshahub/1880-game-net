// ChessLogic.js - منطق کامل و صحیح حرکات شطرنج

import { BOARD_SIZE } from './ChessBoard';

/**
 * ساخت boardState از board
 */
function buildBoardState(board) {
  const boardState = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
  
  const squares = board.children.filter(
    child => child.userData && child.userData.row !== undefined && child.userData.col !== undefined
  );
  
  squares.forEach(square => {
    if (square.userData && square.userData.piece) {
      const piece = square.userData.piece;
      const pieceRow = square.userData.row;
      const pieceCol = square.userData.col;
      
      if (pieceRow >= 0 && pieceRow < BOARD_SIZE && pieceCol >= 0 && pieceCol < BOARD_SIZE) {
        if (piece.userData && piece.userData.type && piece.userData.color) {
          boardState[pieceRow][pieceCol] = {
            type: piece.userData.type,
            color: piece.userData.color,
            isWhite: piece.userData.color === 'white'
          };
        }
      }
    }
  });
  
  return boardState;
}

/**
 * پیدا کردن موقعیت شاه
 */
function findKing(boardState, color) {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const square = boardState[row][col];
      if (square && square.type === 'king' && square.color === color) {
        return { row, col };
      }
    }
  }
  return null;
}

/**
 * بررسی اینکه آیا یک موقعیت در مرزهای تخته است
 */
function isValidPosition(row, col) {
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
}

/**
 * محاسبه حرکات سرباز
 */
function getPawnMoves(row, col, boardState, isWhite) {
  const moves = [];
  const direction = isWhite ? 1 : -1;
  const startRow = isWhite ? 1 : 6;
  
  // حرکت یک خانه به جلو
  const nextRow = row + direction;
  if (isValidPosition(nextRow, col)) {
    if (!boardState[nextRow][col]) {
      moves.push({ row: nextRow, col });
      
      // حرکت دو خانه در شروع
      if (row === startRow) {
        const doubleRow = row + direction * 2;
        if (isValidPosition(doubleRow, col) && !boardState[doubleRow][col]) {
          moves.push({ row: doubleRow, col });
        }
      }
    }
  }
  
  // حمله مورب
  for (const colOffset of [-1, 1]) {
    const attackRow = row + direction;
    const attackCol = col + colOffset;
    if (isValidPosition(attackRow, attackCol)) {
      const square = boardState[attackRow][attackCol];
      if (square && square.color !== (isWhite ? 'white' : 'black')) {
        moves.push({ row: attackRow, col: attackCol });
      }
    }
  }
  
  return moves;
}

/**
 * محاسبه حرکات رخ
 */
function getRookMoves(row, col, boardState, isWhite) {
  const moves = [];
  const directions = [
    { row: -1, col: 0 }, // بالا
    { row: 1, col: 0 },  // پایین
    { row: 0, col: -1 }, // چپ
    { row: 0, col: 1 },  // راست
  ];
  
  directions.forEach(dir => {
    for (let i = 1; i < BOARD_SIZE; i++) {
      const newRow = row + dir.row * i;
      const newCol = col + dir.col * i;
      
      if (!isValidPosition(newRow, newCol)) break;
      
      const square = boardState[newRow][newCol];
      if (!square) {
        moves.push({ row: newRow, col: newCol });
      } else {
        if (square.color !== (isWhite ? 'white' : 'black')) {
          moves.push({ row: newRow, col: newCol });
        }
        break;
      }
    }
  });
  
  return moves;
}

/**
 * محاسبه حرکات فیل
 */
function getBishopMoves(row, col, boardState, isWhite) {
  const moves = [];
  const directions = [
    { row: -1, col: -1 }, // بالا-چپ
    { row: -1, col: 1 },  // بالا-راست
    { row: 1, col: -1 },  // پایین-چپ
    { row: 1, col: 1 },   // پایین-راست
  ];
  
  directions.forEach(dir => {
    for (let i = 1; i < BOARD_SIZE; i++) {
      const newRow = row + dir.row * i;
      const newCol = col + dir.col * i;
      
      if (!isValidPosition(newRow, newCol)) break;
      
      const square = boardState[newRow][newCol];
      if (!square) {
        moves.push({ row: newRow, col: newCol });
      } else {
        if (square.color !== (isWhite ? 'white' : 'black')) {
          moves.push({ row: newRow, col: newCol });
        }
        break;
      }
    }
  });
  
  return moves;
}

/**
 * محاسبه حرکات اسب
 */
function getKnightMoves(row, col, boardState, isWhite) {
  const moves = [];
  const knightMoves = [
    { row: -2, col: -1 }, { row: -2, col: 1 },
    { row: -1, col: -2 }, { row: -1, col: 2 },
    { row: 1, col: -2 }, { row: 1, col: 2 },
    { row: 2, col: -1 }, { row: 2, col: 1 },
  ];
  
  knightMoves.forEach(move => {
    const newRow = row + move.row;
    const newCol = col + move.col;
    
    if (!isValidPosition(newRow, newCol)) return;
    
    const square = boardState[newRow][newCol];
    if (!square || square.color !== (isWhite ? 'white' : 'black')) {
      moves.push({ row: newRow, col: newCol });
    }
  });
  
  return moves;
}

/**
 * محاسبه حرکات وزیر
 */
function getQueenMoves(row, col, boardState, isWhite) {
  const moves = [];
  // وزیر ترکیب رخ و فیل است
  moves.push(...getRookMoves(row, col, boardState, isWhite));
  moves.push(...getBishopMoves(row, col, boardState, isWhite));
  return moves;
}

/**
 * محاسبه حرکات شاه (بدون بررسی کیش - این در getValidMoves انجام می‌شود)
 */
function getKingMoves(row, col, boardState, isWhite) {
  const moves = [];
  const kingMoves = [
    { row: -1, col: -1 }, { row: -1, col: 0 }, { row: -1, col: 1 },
    { row: 0, col: -1 }, { row: 0, col: 1 },
    { row: 1, col: -1 }, { row: 1, col: 0 }, { row: 1, col: 1 },
  ];
  
  kingMoves.forEach(move => {
    const newRow = row + move.row;
    const newCol = col + move.col;
    
    if (!isValidPosition(newRow, newCol)) return;
    
    const square = boardState[newRow][newCol];
    // شاه نمی‌تواند به خانه‌ای برود که مهره خودی در آن است
    if (!square || square.color !== (isWhite ? 'white' : 'black')) {
      moves.push({ row: newRow, col: newCol });
    }
  });
  
  return moves;
}

/**
 * بررسی اینکه آیا یک موقعیت مورد حمله است
 */
function isSquareAttacked(row, col, boardState, attackerColor) {
  const isWhite = attackerColor === 'white';
  
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const square = boardState[r][c];
      if (square && square.color === attackerColor) {
        let moves = [];
        
        switch (square.type) {
          case 'pawn':
            moves = getPawnMoves(r, c, boardState, isWhite);
            break;
          case 'rook':
            moves = getRookMoves(r, c, boardState, isWhite);
            break;
          case 'knight':
            moves = getKnightMoves(r, c, boardState, isWhite);
            break;
          case 'bishop':
            moves = getBishopMoves(r, c, boardState, isWhite);
            break;
          case 'queen':
            moves = getQueenMoves(r, c, boardState, isWhite);
            break;
          case 'king':
            moves = getKingMoves(r, c, boardState, isWhite);
            break;
        }
        
        if (moves.some(m => m.row === row && m.col === col)) {
          return true;
        }
      }
    }
  }
  
  return false;
}

/**
 * بررسی اینکه آیا شاه در کیش است
 */
export function isKingInCheck(board, kingColor) {
  const boardState = buildBoardState(board);
  const king = findKing(boardState, kingColor);
  
  if (!king) return false;
  
  const attackerColor = kingColor === 'white' ? 'black' : 'white';
  return isSquareAttacked(king.row, king.col, boardState, attackerColor);
}

/**
 * بررسی اینکه آیا یک حرکت شاه را در کیش قرار می‌دهد
 */
function wouldMovePutKingInCheck(piece, move, board) {
  if (!piece || !piece.userData || !board) return false;
  
  const pieceColor = piece.userData.color;
  const oldRow = piece.userData.row;
  const oldCol = piece.userData.col;
  
  // ساخت boardState با حرکت شبیه‌سازی شده
  const boardState = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
  
  const squares = board.children.filter(
    child => child.userData && child.userData.row !== undefined && child.userData.col !== undefined
  );
  
  squares.forEach(square => {
    if (square.userData && square.userData.piece) {
      const pieceOnSquare = square.userData.piece;
      const pieceRow = square.userData.row;
      const pieceCol = square.userData.col;
      
      // نادیده گرفتن مهره انتخاب شده
      if (pieceRow === oldRow && pieceCol === oldCol) {
        return;
      }
      
      // نادیده گرفتن مهره capture شده
      if (pieceRow === move.row && pieceCol === move.col) {
        return;
      }
      
      if (pieceRow >= 0 && pieceRow < BOARD_SIZE && pieceCol >= 0 && pieceCol < BOARD_SIZE) {
        if (pieceOnSquare.userData && pieceOnSquare.userData.type && pieceOnSquare.userData.color) {
          boardState[pieceRow][pieceCol] = {
            type: pieceOnSquare.userData.type,
            color: pieceOnSquare.userData.color,
            isWhite: pieceOnSquare.userData.color === 'white'
          };
        }
      }
    }
  });
  
  // اضافه کردن مهره در موقعیت جدید
  boardState[move.row][move.col] = {
    type: piece.userData.type,
    color: pieceColor,
    isWhite: pieceColor === 'white'
  };
  
  // پیدا کردن شاه
  const king = findKing(boardState, pieceColor);
  if (!king) return false;
  
  // بررسی اینکه آیا شاه مورد حمله است
  const attackerColor = pieceColor === 'white' ? 'black' : 'white';
  return isSquareAttacked(king.row, king.col, boardState, attackerColor);
}

/**
 * محاسبه حرکات مجاز برای یک مهره
 */
export function getValidMoves(piece, board) {
  if (!piece || !piece.userData) {
    return [];
  }
  
  const { type, color, row, col } = piece.userData;
  
  if (row === undefined || col === undefined) {
    return [];
  }
  
  const isWhite = color === 'white';
  const boardState = buildBoardState(board);
  
  // حذف مهره انتخاب شده از boardState
  boardState[row][col] = null;
  
  let moves = [];
  
  // محاسبه حرکات بر اساس نوع مهره
  switch (type) {
    case 'pawn':
      moves = getPawnMoves(row, col, boardState, isWhite);
      break;
    case 'rook':
      moves = getRookMoves(row, col, boardState, isWhite);
      break;
    case 'knight':
      moves = getKnightMoves(row, col, boardState, isWhite);
      break;
    case 'bishop':
      moves = getBishopMoves(row, col, boardState, isWhite);
      break;
    case 'queen':
      moves = getQueenMoves(row, col, boardState, isWhite);
      break;
    case 'king':
      moves = getKingMoves(row, col, boardState, isWhite);
      break;
    default:
      return [];
  }
  
  // فیلتر کردن حرکاتی که شاه را در کیش قرار می‌دهند
  const validMoves = moves.filter(move => {
    return !wouldMovePutKingInCheck(piece, move, board);
  });
  
  return validMoves;
}

/**
 * بررسی اینکه آیا کیش‌مات است
 */
export function isCheckmate(board, kingColor) {
  // اگر شاه در کیش نیست، کیش‌مات نیست
  if (!isKingInCheck(board, kingColor)) {
    return false;
  }
  
  // بررسی اینکه آیا هیچ حرکتی وجود دارد که کیش را برطرف کند
  const squares = board.children.filter(
    child => child.userData && child.userData.row !== undefined && child.userData.col !== undefined
  );
  
  // بررسی همه مهره‌های این رنگ
  for (const square of squares) {
    if (square.userData && square.userData.piece) {
      const piece = square.userData.piece;
      if (piece.userData && piece.userData.color === kingColor) {
        const validMoves = getValidMoves(piece, board);
        
        // اگر حتی یک حرکت معتبر وجود دارد، کیش‌مات نیست
        if (validMoves.length > 0) {
          return false;
        }
      }
    }
  }
  
  // هیچ حرکتی وجود ندارد، پس کیش‌مات است
  return true;
}
