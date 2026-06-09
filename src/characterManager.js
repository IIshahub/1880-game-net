// characterManager.js - مدیریت کاراکترها (built-in + custom)

import { characters as builtInCharacters, defaultCharacter } from './characters';
import { loadCustomCharacters, saveCustomCharacters } from './customCharacterStorage';

let customCharacters = {};
let currentCharacterId = defaultCharacter;
let initialized = false;

function ensureInitialized() {
  if (!initialized && typeof window !== 'undefined') {
    customCharacters = loadCustomCharacters();
    initialized = true;
  }
}

function getCharactersMap() {
  ensureInitialized();
  return { ...builtInCharacters, ...customCharacters };
}

/**
 * دریافت کاراکتر فعلی
 */
export function getCurrentCharacter() {
  const map = getCharactersMap();
  return map[currentCharacterId] || map[defaultCharacter];
}

/**
 * تغییر کاراکتر
 */
export function setCharacter(characterId) {
  const map = getCharactersMap();
  if (!map[characterId]) {
    console.warn(`Character "${characterId}" not found, using default`);
    characterId = defaultCharacter;
  }
  currentCharacterId = characterId;
  return map[currentCharacterId];
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
  return Object.keys(getCharactersMap()).map((key) => ({
    key,
    ...getCharactersMap()[key],
  }));
}

/**
 * Check if display name is already used (case-insensitive)
 */
export function isCharacterNameTaken(name) {
  const normalized = name.trim().toLowerCase();
  if (!normalized) return true;
  return Object.values(getCharactersMap()).some(
    (c) => c.name.trim().toLowerCase() === normalized,
  );
}

/**
 * Create a custom photo character (texture = cropped JPEG data URL)
 */
export function createCustomCharacter(name, textureDataUrl) {
  ensureInitialized();
  const trimmed = name.trim();
  if (!trimmed) {
    throw new Error('Character name is required');
  }
  if (isCharacterNameTaken(trimmed)) {
    throw new Error('This name is already taken');
  }

  const id = `custom-${Date.now()}`;
  const character = {
    id,
    name: trimmed,
    icon: '📷',
    description: 'Custom photo character',
    texture: textureDataUrl,
    cubeSize: [24, 24, 28],
    colors: {
      body: 0xffffff,
      cap: 0xffffff,
      eyes: 0x000000,
    },
    style: 'textured',
    custom: true,
  };

  customCharacters[id] = character;
  saveCustomCharacters(customCharacters);
  return id;
}
