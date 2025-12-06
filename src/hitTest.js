import * as THREE from "three";
import { metadata as rows } from "./components/Map";
import { player, position } from "./components/Player";

// عناصر DOM برای نمایش نتیجه برخورد
const resultDOM = document.getElementById("result-container");
const finalScoreDOM = document.getElementById("final-score");

/**
 * تابع تشخیص برخورد بازیکن با وسایل نقلیه
 * این تابع در هر فریم بازی فراخوانی می‌شود تا بررسی کند آیا بازیکن با ماشین/کامیون برخورد کرده یا نه
 */
export function hitTest() {
  // دریافت ردیف فعلی که بازیکن در آن قرار دارد
  const row = rows[position.currentRow - 1];
  if (!row) return; // اگر ردیف وجود نداشت، خروج

  // فقط برای ردیف‌های جاده (ماشین/کامیون) بررسی کن
  if (row.type === "car" || row.type === "truck") {
    // ایجاد محدوده مرزی (Bounding Box) برای بازیکن
    const playerBoundingBox = new THREE.Box3();
    playerBoundingBox.setFromObject(player);

    // بررسی هر وسیله نقلیه در ردیف فعلی
    row.vehicles.forEach(({ ref }) => {
      if (!ref) throw Error("Vehicle reference is missing");

      // ایجاد محدوده مرزی برای وسیله نقلیه
      const vehicleBoundingBox = new THREE.Box3();
      vehicleBoundingBox.setFromObject(ref);

      // بررسی تقاطع دو محدوده مرزی (برخورد فیزیکی)
      if (playerBoundingBox.intersectsBox(vehicleBoundingBox)) {
        // اگر عناصر DOM وجود نداشتند، خروج
        if (!resultDOM || !finalScoreDOM) return;
        
        // نمایش نتیجه برخورد به کاربر
        resultDOM.style.visibility = "visible";
        finalScoreDOM.innerText = position.currentRow.toString();
      }
    });
  }
}