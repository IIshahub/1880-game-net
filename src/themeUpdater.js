// themeUpdater.js - به‌روزرسانی رنگ‌های صحنه بر اساس تم

import * as THREE from "three";
import { getCurrentTheme } from "./themeManager";

/**
 * به‌روزرسانی رنگ مواد بر اساس تم فعلی
 */
export function updateSceneTheme(scene, map, player, ambientLight, directionalLight) {
  const theme = getCurrentTheme();
  const colors = theme.colors;

  // به‌روزرسانی نور محیطی
  if (ambientLight) {
    ambientLight.color.setHex(colors.ambientLight);
  }

  // به‌روزرسانی نور جهت‌دار
  if (directionalLight) {
    directionalLight.color.setHex(colors.directionalLight);
  }

  // به‌روزرسانی نقشه (چمن و جاده)
  if (map) {
    map.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        // چمن
        if (child.material.color && child.material.color.getHex() === 0xbaf455) {
          child.material.color.setHex(colors.grass);
        }
        // جاده
        if (child.material.color && child.material.color.getHex() === 0x454a59) {
          child.material.color.setHex(colors.road);
        }
        // تنه درخت
        if (child.material.color && child.material.color.getHex() === 0x4d2926) {
          child.material.color.setHex(colors.treeTrunk);
        }
        // تاج درخت
        if (child.material.color && child.material.color.getHex() === 0x7aa21d) {
          child.material.color.setHex(colors.treeCrown);
        }
        // کامیون کانتینر
        if (child.material.color && child.material.color.getHex() === 0xb4c6fc) {
          child.material.color.setHex(colors.truckCargo);
        }
      }
    });
  }

  // به‌روزرسانی بازیکن
  if (player) {
    let bodyFound = false;
    let capFound = false;
    player.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        // بدنه بازیکن - اولین mesh بزرگ که پیدا می‌شود
        if (!bodyFound && child.geometry && child.geometry.type === "BoxGeometry") {
          const size = child.geometry.parameters;
          if (size.width === 15 && size.height === 15 && size.depth === 20) {
            child.material.color.setHex(colors.playerBody);
            bodyFound = true;
          }
        }
        // کلاه بازیکن - mesh کوچک
        if (!capFound && child.geometry && child.geometry.type === "BoxGeometry") {
          const size = child.geometry.parameters;
          if (size.width === 2 && size.height === 4 && size.depth === 2) {
            child.material.color.setHex(colors.playerCap);
            capFound = true;
          }
        }
      }
    });
  }

  // به‌روزرسانی وسایل نقلیه (ماشین‌ها و کامیون‌ها)
  // این کار در Map.js انجام می‌شود هنگام ایجاد وسایل نقلیه جدید
}

/**
 * به‌روزرسانی رنگ یک ماده خاص
 */
export function updateMaterialColor(material, oldColor, newColor) {
  if (material && material.color) {
    const currentHex = material.color.getHex();
    if (currentHex === oldColor || currentHex === newColor) {
      material.color.setHex(newColor);
    }
  }
}

