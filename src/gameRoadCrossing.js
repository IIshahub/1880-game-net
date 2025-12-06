// gameRoadCrossing.js - منطق بازی Road Crossing

import * as THREE from "three";
import { Renderer } from "./components/Renderer";
import { Camera } from "./components/Camera";
import { DirectionalLight } from "./components/DirectionalLight";
import { player, initializePlayer } from "./components/Player";
import { map, initializeMap } from "./components/Map";
import { animateVehicles } from "./animateVehicles";
import { animatePlayer } from "./animatePlayer";
import { hitTest } from "./hitTest";
import { getAllThemes, setTheme, getCurrentThemeName } from "./themeManager";
import { updateSceneTheme } from "./themeUpdater";
import "./collectUserInput";

let scene, camera, renderer, ambientLight, dirLight;
let scoreDOM, resultDOM;
let animationId = null;

/**
 * راه‌اندازی بازی Road Crossing
 */
export function startRoadCrossingGame() {
  // ایجاد صحنه اصلی بازی
  scene = new THREE.Scene();
  scene.add(player);
  scene.add(map);

  // تنظیم نور محیطی
  ambientLight = new THREE.AmbientLight();
  scene.add(ambientLight);

  // تنظیم نور جهت‌دار
  dirLight = DirectionalLight();
  dirLight.target = player;
  player.add(dirLight);

  // ایجاد و تنظیم دوربین
  camera = Camera();
  player.add(camera);

  // عناصر DOM
  scoreDOM = document.getElementById("score");
  resultDOM = document.getElementById("result-container");

  // مقداردهی اولیه بازی
  initializeGame();

  // افزودن رویداد کلیک برای دکمه تلاش مجدد
  document.querySelector("#retry")?.addEventListener("click", initializeGame);

  // مقداردهی اولیه منوی تم
  initializeThemeMenu();

  // ایجاد رندرر و تنظیم حلقه انیمیشن
  renderer = Renderer();
  renderer.setAnimationLoop(animate);
}

/**
 * تابع مقداردهی اولیه منوی تم
 */
function initializeThemeMenu() {
  const themeButtonsContainer = document.getElementById("theme-buttons");
  const themeModal = document.getElementById("theme-modal");
  const themeButton = document.getElementById("theme-button");
  const themeModalClose = document.getElementById("theme-modal-close");
  
  if (!themeButtonsContainer || !themeModal || !themeButton) return;

  const themes = getAllThemes();
  const currentTheme = getCurrentThemeName();

  // ایجاد دکمه‌های تم
  themes.forEach((theme) => {
    const button = document.createElement("button");
    button.className = `theme-button ${theme.key === currentTheme ? "active" : ""}`;
    button.dataset.themeKey = theme.key;
    button.innerHTML = `
      <span class="theme-button-icon">${theme.icon}</span>
      <span class="theme-button-name">${theme.name}</span>
    `;
    button.addEventListener("click", () => changeTheme(theme.key));
    themeButtonsContainer.appendChild(button);
  });

  // باز کردن مدال
  themeButton.addEventListener("click", () => {
    themeModal.classList.add("active");
  });

  // بستن مدال با کلیک روی overlay
  const overlay = themeModal.querySelector(".theme-modal-overlay");
  if (overlay) {
    overlay.addEventListener("click", () => {
      themeModal.classList.remove("active");
    });
  }

  // بستن مدال با دکمه X
  if (themeModalClose) {
    themeModalClose.addEventListener("click", () => {
      themeModal.classList.remove("active");
    });
  }

  // بستن مدال با کلید ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && themeModal.classList.contains("active")) {
      themeModal.classList.remove("active");
    }
  });
}

/**
 * تابع تغییر تم
 */
function changeTheme(themeName) {
  setTheme(themeName);
  
  // به‌روزرسانی دکمه‌های فعال
  const buttons = document.querySelectorAll(".theme-button");
  buttons.forEach((btn) => {
    btn.classList.remove("active");
    if (btn.dataset.themeKey === themeName) {
      btn.classList.add("active");
    }
  });

  // به‌روزرسانی صحنه با تم جدید
  updateSceneTheme(scene, map, player, ambientLight, dirLight);
  
  // بازسازی نقشه برای اعمال تم جدید
  initializeMap();

  // بستن مدال بعد از انتخاب تم
  const themeModal = document.getElementById("theme-modal");
  if (themeModal) {
    themeModal.classList.remove("active");
  }
}

/**
 * تابع مقداردهی اولیه بازی
 */
function initializeGame() {
  initializePlayer();
  initializeMap();

  // تنظیم اولیه رابط کاربری
  if (scoreDOM) scoreDOM.innerText = "0";
  if (resultDOM) resultDOM.style.visibility = "hidden";
}

/**
 * تابع انیمیشن اصلی
 */
function animate() {
  animateVehicles();
  animatePlayer();
  hitTest();

  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }
}

/**
 * توقف بازی
 */
export function stopRoadCrossingGame() {
  if (renderer) {
    renderer.setAnimationLoop(null);
  }
  if (scene) {
    scene.clear();
  }
}

