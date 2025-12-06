// chessThemes.js - تم‌های تخته شطرنج

export const chessThemes = {
  classic: {
    id: 'classic',
    name: 'Classic',
    icon: '♟️',
    lightSquare: 0xf0d9b5, // بژ روشن
    darkSquare: 0xb58863,  // قهوه‌ای تیره
    border: 0x654321,       // قهوه‌ای تیره‌تر
    description: 'Classic wooden chessboard'
  },
  modern: {
    id: 'modern',
    name: 'Modern',
    icon: '⚫',
    lightSquare: 0xe8e8e8, // خاکستری روشن
    darkSquare: 0x2c2c2c,  // خاکستری تیره
    border: 0x1a1a1a,      // سیاه
    description: 'Modern minimalist style'
  },
  marble: {
    id: 'marble',
    name: 'Marble',
    icon: '🏛️',
    lightSquare: 0xf5f5dc, // بژ روشن (مرمر)
    darkSquare: 0x8b7355,  // قهوه‌ای مرمری
    border: 0x6b5b4a,      // قهوه‌ای تیره
    description: 'Elegant marble chessboard'
  },
  dark: {
    id: 'dark',
    name: 'Dark',
    icon: '🌑',
    lightSquare: 0x4a4a4a, // خاکستری تیره
    darkSquare: 0x1a1a1a,  // سیاه
    border: 0x0a0a0a,      // سیاه خیلی تیره
    description: 'Dark mode chessboard'
  },
  green: {
    id: 'green',
    name: 'Green',
    icon: '🟢',
    lightSquare: 0xd4e6d1, // سبز روشن
    darkSquare: 0x6b8e5a,  // سبز تیره
    border: 0x4a5d3a,      // سبز خیلی تیره
    description: 'Green felt chessboard'
  }
};

let currentChessTheme = chessThemes.classic;

/**
 * دریافت تم فعلی
 */
export function getCurrentChessTheme() {
  return currentChessTheme;
}

/**
 * تنظیم تم جدید
 */
export function setChessTheme(themeId) {
  if (chessThemes[themeId]) {
    currentChessTheme = chessThemes[themeId];
    return currentChessTheme;
  }
  return currentChessTheme;
}

/**
 * دریافت همه تم‌ها
 */
export function getAllChessThemes() {
  return Object.values(chessThemes);
}

