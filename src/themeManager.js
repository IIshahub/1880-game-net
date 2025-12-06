// themeManager.js - مدیریت تغییر تم‌ها

import { themes, defaultTheme } from "./themes";

let currentThemeName = defaultTheme;

/**
 * دریافت تم فعلی
 */
export function getCurrentTheme() {
  return themes[currentThemeName];
}

/**
 * تغییر تم
 */
export function setTheme(themeName) {
  if (!themes[themeName]) {
    console.warn(`Theme "${themeName}" not found, using default`);
    themeName = defaultTheme;
  }
  currentThemeName = themeName;
  return getCurrentTheme();
}

/**
 * دریافت نام تم فعلی
 */
export function getCurrentThemeName() {
  return currentThemeName;
}

/**
 * دریافت لیست تمام تم‌ها
 */
export function getAllThemes() {
  return Object.keys(themes).map((key) => ({
    key,
    ...themes[key],
  }));
}

