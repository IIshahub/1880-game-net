// main.js
import { getAllGames, setCurrentGame } from "./gameManager";
import { startRoadCrossingGame } from "./gameRoadCrossing";
import "./style.css";

// مقداردهی اولیه منوی بازی
initializeGameMenu();

/**
 * تابع مقداردهی اولیه منوی بازی
 */
function initializeGameMenu() {
  const gameCardsContainer = document.getElementById("game-cards");
  const gameMenu = document.getElementById("game-menu");
  const gameScreen = document.getElementById("game-screen");
  
  if (!gameCardsContainer || !gameMenu || !gameScreen) return;

  const games = getAllGames();

  // ایجاد کارت‌های بازی
  games.forEach((game) => {
    const card = document.createElement("div");
    card.className = "game-card";
    card.style.borderColor = game.color;
    card.innerHTML = `
      <div class="game-card-icon">${game.icon}</div>
      <h3 class="game-card-name">${game.name}</h3>
      <p class="game-card-description">${game.description}</p>
    `;
    card.addEventListener("click", () => selectGame(game.id));
    gameCardsContainer.appendChild(card);
  });
}

/**
 * تابع انتخاب بازی
 */
function selectGame(gameId) {
  setCurrentGame(gameId);
  
  // مخفی کردن منوی بازی
  const gameMenu = document.getElementById("game-menu");
  const gameScreen = document.getElementById("game-screen");
  
  if (gameMenu) gameMenu.style.display = "none";
  if (gameScreen) gameScreen.style.display = "block";

  // راه‌اندازی بازی انتخاب شده
  if (gameId === "roadCrossing") {
    startRoadCrossingGame();
  }
  // بازی‌های دیگر را می‌توانید اینجا اضافه کنید
  // else if (gameId === "game2") {
  //   startGame2();
  // }
}