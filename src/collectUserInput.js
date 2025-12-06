import { queueMove } from "./components/Player";

// اضافه کردن رویداد کلیک برای دکمه "جلو" (forward)
document
  .getElementById("forward")
  ?.addEventListener("click", () => queueMove("forward"));

// اضافه کردن رویداد کلیک برای دکمه "عقب" (backward)
document
  .getElementById("backward")
  ?.addEventListener("click", () => queueMove("backward"));

// اضافه کردن رویداد کلیک برای دکمه "چپ" (left)
document
  .getElementById("left")
  ?.addEventListener("click", () => queueMove("left"));

// اضافه کردن رویداد کلیک برای دکمه "راست" (right)
document
  .getElementById("right")
  ?.addEventListener("click", () => queueMove("right"));

// اضافه کردن رویداد کیبورد برای کلیدهای جهت‌دار
window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp") {
    event.preventDefault(); // جلوگیری از اسکرول صفحه
    queueMove("forward");
  } else if (event.key === "ArrowDown") {
    event.preventDefault(); // جلوگیری از اسکرول صفحه
    queueMove("backward");
  } else if (event.key === "ArrowLeft") {
    event.preventDefault(); // جلوگیری از اسکرول صفحه
    queueMove("left");
  } else if (event.key === "ArrowRight") {
    event.preventDefault(); // جلوگیری از اسکرول صفحه
    queueMove("right");
  }
});