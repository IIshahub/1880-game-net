// map.js
import * as THREE from "three";
import { generateRows } from "../utilities/generateRows";
import { Grass } from "./Grass";
import { Road } from "./Road";
import { Tree } from "./Tree";
import { Car } from "./Car";
import { Truck } from "./Truck";

// متادیتای نقشه برای ذخیره اطلاعات ردیف‌ها
export const metadata = [];

// گروه اصلی نقشه
export const map = new THREE.Group();

/**
 * تابع مقداردهی اولیه نقشه
 */
export function initializeMap() {
  // پاک کردن ردیف‌های قبلی
  metadata.length = 0;
  map.remove(...map.children);

  // ایجاد ردیف‌های اولیه (چمن)
  for (let rowIndex = 0; rowIndex > -5; rowIndex--) {
    const grass = Grass(rowIndex);
    map.add(grass);
  }
  addRows(); // اضافه کردن ردیف‌های جدید
}

/**
 * اضافه کردن ردیف‌های جدید به نقشه
 */
export function addRows() {
  const newMetadata = generateRows(20); // تولید 20 ردیف جدید

  const startIndex = metadata.length;
  metadata.push(...newMetadata); // ذخیره متادیتای ردیف‌های جدید

  // پردازش هر ردیف جدید
  newMetadata.forEach((rowData, index) => {
    const rowIndex = startIndex + index + 1;

    // ایجاد ردیف جنگل
    if (rowData.type === "forest") {
      const row = Grass(rowIndex);
      rowData.trees.forEach(({ tileIndex, height }) => {
        const tree = Tree(tileIndex, height);
        row.add(tree);
      });
      map.add(row);
    }

    // ایجاد ردیف جاده با ماشین‌ها
    if (rowData.type === "car") {
      const row = Road(rowIndex);
      rowData.vehicles.forEach((vehicle) => {
        const car = Car(vehicle.initialTileIndex, rowData.direction, vehicle.color);
        vehicle.ref = car; // ذخیره reference برای تشخیص برخورد
        row.add(car);
      });
      map.add(row);
    }

    // ایجاد ردیف جاده با کامیون‌ها
    if (rowData.type === "truck") {
      const row = Road(rowIndex);
      rowData.vehicles.forEach((vehicle) => {
        const truck = Truck(vehicle.initialTileIndex, rowData.direction, vehicle.color);
        vehicle.ref = truck; // ذخیره reference برای تشخیص برخورد
        row.add(truck);
      });
      map.add(row);
    }
  });
}