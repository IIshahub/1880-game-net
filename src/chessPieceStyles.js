// chessPieceStyles.js - استایل‌های مهره‌های شطرنج

export const chessPieceStyles = {
  classic: {
    id: 'classic',
    name: 'Classic',
    icon: '♟️',
    whiteColor: 0xffffff,
    blackColor: 0x1a1a1a,
    crownColor: 0xffd700, // طلایی برای تاج شاه
    description: 'Classic black and white pieces'
  },
  gold: {
    id: 'gold',
    name: 'Gold',
    icon: '👑',
    whiteColor: 0xffd700, // طلایی
    blackColor: 0x8b4513, // قهوه‌ای
    crownColor: 0xff6347, // قرمز برای تاج
    description: 'Luxurious gold and bronze pieces'
  },
  silver: {
    id: 'silver',
    name: 'Silver',
    icon: '⚪',
    whiteColor: 0xc0c0c0, // نقره‌ای
    blackColor: 0x2c2c2c, // خاکستری تیره
    crownColor: 0x4169e1, // آبی برای تاج
    description: 'Elegant silver pieces'
  },
  red: {
    id: 'red',
    name: 'Red',
    icon: '🔴',
    whiteColor: 0xff6b6b, // قرمز روشن
    blackColor: 0x8b0000, // قرمز تیره
    crownColor: 0xffd700, // طلایی برای تاج
    description: 'Bold red pieces'
  },
  blue: {
    id: 'blue',
    name: 'Blue',
    icon: '🔵',
    whiteColor: 0x87ceeb, // آبی روشن
    blackColor: 0x00008b, // آبی تیره
    crownColor: 0xffd700, // طلایی برای تاج
    description: 'Cool blue pieces'
  }
};

let currentPieceStyle = chessPieceStyles.classic;

/**
 * دریافت استایل فعلی
 */
export function getCurrentPieceStyle() {
  return currentPieceStyle;
}

/**
 * تنظیم استایل جدید
 */
export function setPieceStyle(styleId) {
  if (chessPieceStyles[styleId]) {
    currentPieceStyle = chessPieceStyles[styleId];
    return currentPieceStyle;
  }
  return currentPieceStyle;
}

/**
 * دریافت همه استایل‌ها
 */
export function getAllPieceStyles() {
  return Object.values(chessPieceStyles);
}

