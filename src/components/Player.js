// player.js
import * as THREE from "three";
import { endsUpInValidPosition } from "../utilities/endsUpInValidPosition";
import { metadata as rows, addRows } from "./Map";
import { getCurrentTheme } from "../themeManager";
import { getCurrentCharacter } from "../characterManager";

// ذخیره reference به قسمت‌های کاراکتر برای به‌روزرسانی
const playerParts = {
  bodyMesh: null,
  capMesh: null,
  eyesMesh: null,
};

/**
 * تابع سازنده بازیکن
 * @returns {THREE.Group} گروه حاوی مدل بازیکن
 */
function Player() {
  const player = new THREE.Group();

  // دریافت تم و کاراکتر فعلی
  const theme = getCurrentTheme();
  const character = getCurrentCharacter();

  // ایجاد بدنه اصلی بازیکن
  playerParts.bodyMesh = new THREE.Mesh(
    new THREE.BoxGeometry(15, 15, 20),
    new THREE.MeshLambertMaterial({ color: character.colors.body, flatShading: true })
  );
  playerParts.bodyMesh.castShadow = true;
  playerParts.bodyMesh.receiveShadow = true;
  playerParts.bodyMesh.position.z = 10;
  player.add(playerParts.bodyMesh);

  // ایجاد کلاه بازیکن
  playerParts.capMesh = new THREE.Mesh(
    new THREE.BoxGeometry(2, 4, 2),
    new THREE.MeshLambertMaterial({ color: character.colors.cap, flatShading: true })
  );
  playerParts.capMesh.position.z = 21;
  playerParts.capMesh.castShadow = true;
  playerParts.capMesh.receiveShadow = true;
  player.add(playerParts.capMesh);

  // ایجاد چشم‌ها
  const eyeSize = 2;
  const eyeSpacing = 4;
  
  playerParts.eyesMesh = new THREE.Group();
  
  // چشم چپ
  const leftEye = new THREE.Mesh(
    new THREE.BoxGeometry(eyeSize, eyeSize, eyeSize),
    new THREE.MeshLambertMaterial({ color: character.colors.eyes, flatShading: true })
  );
  leftEye.position.set(-eyeSpacing, 8, 18);
  leftEye.castShadow = true;
  playerParts.eyesMesh.add(leftEye);

  // چشم راست
  const rightEye = new THREE.Mesh(
    new THREE.BoxGeometry(eyeSize, eyeSize, eyeSize),
    new THREE.MeshLambertMaterial({ color: character.colors.eyes, flatShading: true })
  );
  rightEye.position.set(eyeSpacing, 8, 18);
  rightEye.castShadow = true;
  playerParts.eyesMesh.add(rightEye);
  
  player.add(playerParts.eyesMesh);

  const playerContainer = new THREE.Group();
  playerContainer.add(player);

  return playerContainer;
}

// ایجاد نمونه بازیکن
export const player = Player();

/**
 * به‌روزرسانی ظاهر کاراکتر
 */
export function updatePlayerCharacter() {
  const character = getCurrentCharacter();
  
  if (playerParts.bodyMesh) {
    playerParts.bodyMesh.material.color.setHex(character.colors.body);
  }
  
  if (playerParts.capMesh) {
    playerParts.capMesh.material.color.setHex(character.colors.cap);
  }
  
  if (playerParts.eyesMesh) {
    playerParts.eyesMesh.children.forEach((eye) => {
      eye.material.color.setHex(character.colors.eyes);
    });
  }
}

// موقعیت و وضعیت بازیکن
export const position = {
  currentRow: 0,  // ردیف فعلی
  currentTile: 0, // ستون فعلی
};

// صف حرکات بازیکن
export const movesQueue = [];

/**
 * تابع مقداردهی اولیه بازیکن
 */
export function initializePlayer() {
  // تنظیم موقعیت اولیه بازیکن
  player.position.x = 0;
  player.position.y = 0;
  player.children[0].position.z = 0;

  // بازنشانی موقعیت منطقی
  position.currentRow = 0;
  position.currentTile = 0;

  // پاک کردن صف حرکات
  movesQueue.length = 0;
}

/**
 * اضافه کردن حرکت به صف حرکات
 * @param {string} direction - جهت حرکت
 */
export function queueMove(direction) {
  // بررسی اعتبار حرکت
  const isValidMove = endsUpInValidPosition(
    { rowIndex: position.currentRow, tileIndex: position.currentTile },
    [...movesQueue, direction]
  );

  if (!isValidMove) return;

  movesQueue.push(direction);
}

/**
 * تکمیل یک حرکت از صف
 */
export function stepCompleted() {
  const direction = movesQueue.shift();

  // به‌روزرسانی موقعیت بر اساس جهت حرکت
  if (direction === "forward") position.currentRow += 1;
  if (direction === "backward") position.currentRow -= 1;
  if (direction === "left") position.currentTile -= 1;
  if (direction === "right") position.currentTile += 1;

  // اضافه کردن ردیف‌های جدید در صورت نیاز
  if (position.currentRow > rows.length - 10) addRows();

  // به‌روزرسانی امتیاز در رابط کاربری
  const scoreDOM = document.getElementById("score");
  if (scoreDOM) scoreDOM.innerText = position.currentRow.toString();
}