// xoThemes.js - تم‌های مختلف برای تخته XO

export const xoThemes = {
  classic: {
    id: 'classic',
    name: 'Classic',
    boardColor: 0x2c3e50, // آبی تیره
    lineColor: 0x34495e, // آبی تیره‌تر
    description: 'Classic dark blue board',
  },
  modern: {
    id: 'modern',
    name: 'Modern',
    boardColor: 0x1a1a2e, // بنفش تیره
    lineColor: 0x16213e, // آبی تیره
    description: 'Modern dark theme',
  },
  marble: {
    id: 'marble',
    name: 'Marble',
    boardColor: 0xe8e8e8, // سفید مایل به خاکستری
    lineColor: 0xd4d4d4, // خاکستری روشن
    description: 'Elegant marble style',
  },
  wood: {
    id: 'wood',
    name: 'Wood',
    boardColor: 0x8b4513, // قهوه‌ای چوب
    lineColor: 0x654321, // قهوه‌ای تیره
    description: 'Warm wooden board',
  },
  neon: {
    id: 'neon',
    name: 'Neon',
    boardColor: 0x0a0a0a, // سیاه
    lineColor: 0x00ffff, // فیروزه‌ای روشن
    description: 'Futuristic neon style',
  },
  green: {
    id: 'green',
    name: 'Nature',
    boardColor: 0x2d5016, // سبز تیره
    lineColor: 0x1a3009, // سبز خیلی تیره
    description: 'Natural green theme',
  },
};

let currentTheme = xoThemes.classic;

/**
 * تنظیم تم فعلی
 */
export function setXOTheme(themeId) {
  if (xoThemes[themeId]) {
    currentTheme = xoThemes[themeId];
    return currentTheme;
  }
  console.warn(`Theme "${themeId}" not found, using default`);
  return currentTheme;
}

/**
 * دریافت تم فعلی
 */
export function getCurrentXOTheme() {
  return currentTheme;
}

/**
 * دریافت تمام تم‌ها
 */
export function getAllXOThemes() {
  return Object.values(xoThemes);
}

