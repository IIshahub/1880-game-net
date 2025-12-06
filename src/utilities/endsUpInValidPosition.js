import { calculateFinalPosition } from "./calculateFinalPosition";
import { minTileIndex, maxTileIndex } from "../constants";
import { metadata as rows } from "../components/Map";


export function endsUpInValidPosition(currentPosition, moves) {
  // محاسبه موقعیت نهایی پس از انجام حرکات
  const finalPosition = calculateFinalPosition(
    currentPosition,
    moves
  );

  // بررسی برخورد با لبه‌های صفحه بازی
  if (
    finalPosition.rowIndex === -1 ||
    finalPosition.tileIndex === minTileIndex - 1 ||
    finalPosition.tileIndex === maxTileIndex + 1
  ) {
    // حرکت نامعتبر - دستور حرکت نادیده گرفته می‌شود
    return false;
  }

  // بررسی برخورد با درختان
  const finalRow = rows[finalPosition.rowIndex - 1];
  if (
    finalRow &&
    finalRow.type === "forest" &&
    finalRow.trees.some(
      (tree) => tree.tileIndex === finalPosition.tileIndex
    )
  ) {
    // حرکت نامعتبر - دستور حرکت نادیده گرفته می‌شود
    return false;
  }

  // اگر هیچ یک از شرایط نامعتبر رخ ندهد، موقعیت معتبر است
  return true;
}