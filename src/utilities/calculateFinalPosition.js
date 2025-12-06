
export function calculateFinalPosition(currentPosition, moves) {
  // استفاده از reduce برای پردازش تمام حرکات و محاسبه موقعیت نهایی
  return moves.reduce((position, direction) => {
    // حرکت به جلو: افزایش مقدار rowIndex
    if (direction === "forward")
      return {
        rowIndex: position.rowIndex + 1,
        tileIndex: position.tileIndex,
      };
    
    // حرکت به عقب: کاهش مقدار rowIndex
    if (direction === "backward")
      return {
        rowIndex: position.rowIndex - 1,
        tileIndex: position.tileIndex,
      };
    
    // حرکت به چپ: کاهش مقدار tileIndex
    if (direction === "left")
      return {
        rowIndex: position.rowIndex,
        tileIndex: position.tileIndex - 1,
      };
    
    // حرکت به راست: افزایش مقدار tileIndex
    if (direction === "right")
      return {
        rowIndex: position.rowIndex,
        tileIndex: position.tileIndex + 1,
      };
    
    // اگر حرکت نامعتبر بود، موقعیت تغییر نمی‌کند
    return position;
  }, currentPosition); // موقعیت اولیه برای شروع محاسبات
}