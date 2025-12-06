// generateRows.js
import * as THREE from "three";
import { minTileIndex, maxTileIndex } from "../constants";
import { getCurrentTheme } from "../themeManager";

/**
 * تولید ردیف‌های جدید برای نقشه بازی
 * @param {number} amount - تعداد ردیف‌هایی که باید تولید شود
 * @returns {Array} آرایه‌ای از ردیف‌های تولید شده
 */
export function generateRows(amount) {
  const rows = [];
  for (let i = 0; i < amount; i++) {
    const rowData = generateRow();
    rows.push(rowData);
  }
  return rows;
}

/**
 * تولید یک ردیف تصادفی از نوع جاده (ماشین/کامیون) یا جنگل
 * @returns {Object} اطلاعات ردیف تولید شده
 */
function generateRow() {
  const type = randomElement(["car", "truck", "forest"]);
  if (type === "car") return generateCarLaneMetadata();
  if (type === "truck") return generateTruckLaneMetadata();
  return generateForesMetadata();
}

/**
 * انتخاب تصادفی یک عنصر از آرایه
 * @param {Array} array - آرایه ورودی
 * @returns {*} یک عنصر تصادفی از آرایه
 */
function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * تولید اطلاعات ردیف جنگل
 * @returns {Object} شامل نوع ردیف و اطلاعات درختان
 */
function generateForesMetadata() {
  const occupiedTiles = new Set();
  const trees = Array.from({ length: 4 }, () => {
    let tileIndex;
    do {
      tileIndex = THREE.MathUtils.randInt(minTileIndex, maxTileIndex);
    } while (occupiedTiles.has(tileIndex));
    occupiedTiles.add(tileIndex);

    const height = randomElement([20, 45, 60]);

    return { tileIndex, height };
  });

  return { type: "forest", trees };
}

/**
 * تولید اطلاعات ردیف جاده با ماشین‌ها
 * @returns {Object} شامل نوع ردیف، جهت حرکت، سرعت و اطلاعات ماشین‌ها
 */
function generateCarLaneMetadata() {
  const direction = randomElement([true, false]);
  const speed = randomElement([125, 156, 188]);

  const occupiedTiles = new Set();

  const vehicles = Array.from({ length: 3 }, () => {
    let initialTileIndex;
    do {
      initialTileIndex = THREE.MathUtils.randInt(
        minTileIndex,
        maxTileIndex
      );
    } while (occupiedTiles.has(initialTileIndex));
    occupiedTiles.add(initialTileIndex - 1);
    occupiedTiles.add(initialTileIndex);
    occupiedTiles.add(initialTileIndex + 1);

    const theme = getCurrentTheme();
    const colorIndex = THREE.MathUtils.randInt(0, theme.colors.carColors.length - 1);
    const color = theme.colors.carColors[colorIndex];

    return { initialTileIndex, color, colorIndex };
  });

  return { type: "car", direction, speed, vehicles };
}

/**
 * تولید اطلاعات ردیف جاده با کامیون‌ها
 * @returns {Object} شامل نوع ردیف، جهت حرکت، سرعت و اطلاعات کامیون‌ها
 */
function generateTruckLaneMetadata() {
  const direction = randomElement([true, false]);
  const speed = randomElement([125, 156, 188]);

  const occupiedTiles = new Set();

  const vehicles = Array.from({ length: 2 }, () => {
    let initialTileIndex;
    do {
      initialTileIndex = THREE.MathUtils.randInt(
        minTileIndex,
        maxTileIndex
      );
    } while (occupiedTiles.has(initialTileIndex));
    occupiedTiles.add(initialTileIndex - 2);
    occupiedTiles.add(initialTileIndex - 1);
    occupiedTiles.add(initialTileIndex);
    occupiedTiles.add(initialTileIndex + 1);
    occupiedTiles.add(initialTileIndex + 2);

    const theme = getCurrentTheme();
    const colorIndex = THREE.MathUtils.randInt(0, theme.colors.truckColors.length - 1);
    const color = theme.colors.truckColors[colorIndex];

    return { initialTileIndex, color, colorIndex };
  });

  return { type: "truck", direction, speed, vehicles };
}