// gameManager.js - مدیریت بازی‌ها

import { games, defaultGame } from "./games";

let currentGameId = null;

/**
 * دریافت لیست تمام بازی‌ها
 */
export function getAllGames() {
  return Object.keys(games).map((key) => ({
    key,
    id: games[key].id || key,
    ...games[key],
  }));
}

/**
 * دریافت اطلاعات یک بازی
 */
export function getGame(gameId) {
  return games[gameId] || games[defaultGame];
}

/**
 * تنظیم بازی فعلی
 */
export function setCurrentGame(gameId) {
  if (!games[gameId]) {
    console.warn(`Game "${gameId}" not found, using default`);
    gameId = defaultGame;
  }
  currentGameId = gameId;
  return getGame(gameId);
}

/**
 * دریافت بازی فعلی
 */
export function getCurrentGame() {
  return currentGameId ? getGame(currentGameId) : getGame(defaultGame);
}

/**
 * دریافت ID بازی فعلی
 */
export function getCurrentGameId() {
  return currentGameId || defaultGame;
}

