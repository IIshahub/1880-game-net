import * as THREE from "three";
import {
  player,
  position,
  movesQueue,
  stepCompleted,
} from "./components/Player";
import { tileSize } from "./constants";

// ایجاد ساعت برای اندازه گیری زمان حرکت
const moveClock = new THREE.Clock(false);

/**
 * تابع اصلی برای انیمیشن حرکت بازیکن
 * در هر فریم رندر فراخوانی می‌شود
 */
export function animatePlayer() {
  // اگر حرکتی در صف وجود ندارد، خروج
  if (!movesQueue.length) return;

  // اگر ساعت حرکت شروع نشده، آن را شروع کن
  if (!moveClock.running) moveClock.start();

  // مدت زمان انجام یک حرکت کامل (ثانیه)
  const stepTime = 0.2;
  // پیشرفت حرکت از 0 تا 1
  const progress = Math.min(1, moveClock.getElapsedTime() / stepTime);

  // اعمال تغییرات موقعیت و چرخش
  setPosition(progress);
  setRotation(progress);

  // وقتی حرکت کامل شد
  if (progress >= 1) {
    stepCompleted(); // ثبت حرکت در سیستم
    moveClock.stop(); // توقف ساعت
  }
}

/**
 * تنظیم موقعیت بازیکن بر اساس پیشرفت حرکت
 * @param {number} progress - مقدار پیشرفت حرکت بین 0 تا 1
 */
function setPosition(progress) {
  // محاسبه موقعیت شروع بر اساس تایل فعلی
  const startX = position.currentTile * tileSize;
  const startY = position.currentRow * tileSize;
  
  // موقعیت پایان ابتدا برابر با موقعیت شروع
  let endX = startX;
  let endY = startY;

  // تعیین موقعیت پایان بر اساس جهت حرکت
  if (movesQueue[0] === "left") endX -= tileSize;
  if (movesQueue[0] === "right") endX += tileSize;
  if (movesQueue[0] === "forward") endY += tileSize;
  if (movesQueue[0] === "backward") endY -= tileSize;

  // محاسبه موقعیت فعلی با درون یابی خطی
  player.position.x = THREE.MathUtils.lerp(startX, endX, progress);
  player.position.y = THREE.MathUtils.lerp(startY, endY, progress);
  
  // اعمال افکت پرش فقط به مدل بازیکن (بدنه اصلی)
  player.children[0].position.z = Math.sin(progress * Math.PI) * 8;
}

/**
 * تنظیم چرخش بازیکن بر اساس جهت حرکت
 * @param {number} progress - مقدار پیشرفت حرکت بین 0 تا 1
 */
function setRotation(progress) {
  // تعیین چرخش نهایی بر اساس جهت حرکت
  let endRotation = 0;
  if (movesQueue[0] == "forward") endRotation = 0;
  if (movesQueue[0] == "left") endRotation = Math.PI / 2;
  if (movesQueue[0] == "right") endRotation = -Math.PI / 2;
  if (movesQueue[0] == "backward") endRotation = Math.PI;

  // اعمال چرخش فقط به مدل بازیکن (بدنه اصلی) نه به کل گروه
  player.children[0].rotation.z = THREE.MathUtils.lerp(
    player.children[0].rotation.z,
    endRotation,
    progress
  );
}