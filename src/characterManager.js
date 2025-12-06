// characterManager.js - مدیریت کاراکترها

import { characters, defaultCharacter } from "./characters";

let currentCharacterId = defaultCharacter;

/**
 * دریافت کاراکتر فعلی
 */
export function getCurrentCharacter() {
  return characters[currentCharacterId] || characters[defaultCharacter];
}

/**
 * تغییر کاراکتر
 */
export function setCharacter(characterId) {
  if (!characters[characterId]) {
    console.warn(`Character "${characterId}" not found, using default`);
    characterId = defaultCharacter;
  }
  currentCharacterId = characterId;
  return getCurrentCharacter();
}

/**
 * دریافت ID کاراکتر فعلی
 */
export function getCurrentCharacterId() {
  return currentCharacterId;
}

/**
 * دریافت لیست تمام کاراکترها
 */
export function getAllCharacters() {
  return Object.keys(characters).map((key) => ({
    key,
    ...characters[key],
  }));
}

