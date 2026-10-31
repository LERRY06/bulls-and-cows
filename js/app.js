
"use strict";

// ========================================
// 1. GAME CONFIGURATION
// ========================================

const DIGIT_COUNT = 4;


// ========================================
// 2. GAME STATE
// ========================================

let secretNumber = "";
let attempts = 0;
let gameOver = false;


// ========================================
// 3. DOM ELEMENTS
// ========================================

const guessForm = document.getElementById("guess-form");
const guessInput = document.getElementById("guess-input");
const validationMessage = document.getElementById("validation-message");
const guessButton = document.getElementById("guess-button");

const newGameButton = document.getElementById("new-game-button");
const restartButton = document.getElementById("restart-button");

const attemptCountElement = document.getElementById("attempt-count");
const bestScoreElement = document.getElementById("best-score");

const historyList = document.getElementById("history-list");

const victoryMessage = document.getElementById("victory-message");
const victoryNumber = document.getElementById("victory-number");
const victoryAttemptCount = document.getElementById("victory-attempt-count");
const victoryNewGameButton = document.getElementById("victory-new-game");

const themeToggle = document.getElementById("theme-toggle");
const gameBoard = document.querySelector(".game-board");


// ========================================
// 4. BEST SCORE
// ========================================

const savedBestScore = Number(localStorage.getItem("bullsBestScore"));

let bestScore =
    Number.isInteger(savedBestScore) && savedBestScore > 0
        ? savedBestScore
        : null;


function updateBestScore() {

    bestScoreElement.textContent =
        bestScore !== null ? bestScore : "-";

}


// ========================================
// 5. GENERATE SECRET NUMBER
// ========================================

function generateSecretNumber() {

    const digits = [];

    digits.push(Math.floor(Math.random() * 9) + 1);

    while (digits.length < DIGIT_COUNT) {

        const digit = Math.floor(Math.random() * 10);

        if (!digits.includes(digit)) {
            digits.push(digit);
        }

    }

    return digits.join("");

}


// ========================================
// 6. START NEW GAME
// ========================================

function startNewGame() {

    const previousNumber = secretNumber;

    do {
        secretNumber = generateSecretNumber();
    } while (secretNumber === previousNumber);

    attempts = 0;
    gameOver = false;

}


// ========================================
// 7. CHECK GUESS
// ========================================

function checkGuess(guess) {

    let bulls = 0;
    let cows = 0;

    for (let i = 0; i < DIGIT_COUNT; i++) {

        if (guess[i] === secretNumber[i]) {

            bulls++;

        } else if (secretNumber.includes(guess[i])) {

            cows++;

        }

    }

    return { bulls, cows };

}


// ========================================
// 8. VALIDATE GUESS
// ========================================

function validateGuess(guess) {

    if (!/^\d{4}$/.test(guess)) {
        return false;
    }

    if (guess[0] === "0") {
        return false;
    }

    if (new Set(guess).size !== DIGIT_COUNT) {
        return false;
    }

    return true;

}


// ========================================
// 9. ADD GUESS TO HISTORY
// ========================================

function addGuessToHistory(guess, result) {

    const emptyMessage =
        historyList.querySelector(".empty-history");

    if (emptyMessage) {
        emptyMessage.remove();
    }

    const row = document.createElement("div");

    row.className = "history-row";

    row.innerHTML = `
        <span>${attempts}</span>
        <span class="guess-number">${guess}</span>
        <span class="bulls-result">${result.bulls}</span>
        <span class="cows-result">${result.cows}</span>
    `;

    historyList.prepend(row);

}


// ========================================
// 10. UPDATE BEST SCORE
// ========================================

function saveBestScore() {

    if (bestScore === null || attempts < bestScore) {

        bestScore = attempts;

        localStorage.setItem(
            "bullsBestScore",
            String(bestScore)
        );

        updateBestScore();

    }

}


// ========================================
// 11. SHOW VICTORY SCREEN
// ========================================

function showVictoryScreen() {

    victoryNumber.textContent = secretNumber;

    victoryAttemptCount.textContent = attempts;

    victoryMessage.classList.remove("hidden");

    gameBoard.classList.add("victory");

}


// ========================================
// 12. HANDLE GUESS SUBMISSION
// ========================================

guessForm.addEventListener("submit", function(event) {

    event.preventDefault();

    if (gameOver) {
        return;
    }

    const guess = guessInput.value.trim();

    if (!validateGuess(guess)) {

        validationMessage.textContent =
            "Въведи 4 различни цифри. Първата не може да бъде 0.";

        validationMessage.style.color = "#ef4444";

        guessInput.focus();

        return;

    }

    validationMessage.textContent = "";

    attempts++;

    const result = checkGuess(guess);

    attemptCountElement.textContent = attempts;

    addGuessToHistory(guess, result);

    // Проверка за победа

    if (result.bulls === DIGIT_COUNT) {

        gameOver = true;

        guessButton.disabled = true;
        guessInput.disabled = true;

        validationMessage.textContent =
            `Поздравления! Позна числото за ${attempts} опита!`;

        validationMessage.style.color = "var(--bull-color)";

        // Запазваме най-добрия резултат
        saveBestScore();

        // Показваме екрана за победа
        showVictoryScreen();

    }

    guessInput.value = "";

    if (!gameOver) {
        guessInput.focus();
    }

});


// ========================================
// 13. RESET GAME INTERFACE
// ========================================

function resetGameInterface() {

    attempts = 0;
    gameOver = false;

    attemptCountElement.textContent = "0";

    guessInput.value = "";
    guessInput.disabled = false;

    guessButton.disabled = false;

    validationMessage.textContent = "";
    validationMessage.style.color = "";

    historyList.innerHTML = `
        <p class="empty-history">
            Все още няма направени опити.
        </p>
    `;

    victoryMessage.classList.add("hidden");

    gameBoard.classList.remove("victory");

    guessInput.focus();

}


// ========================================
// 14. NEW GAME BUTTON
// ========================================

newGameButton.addEventListener("click", function() {

    startNewGame();

    resetGameInterface();

});


// ========================================
// 15. RESTART BUTTON
// ========================================

restartButton.addEventListener("click", function() {

    // Запазваме тайното число

    resetGameInterface();

});


// ========================================
// 16. VICTORY NEW GAME BUTTON
// ========================================

victoryNewGameButton.addEventListener("click", function() {

    startNewGame();

    resetGameInterface();

});


// ========================================
// 17. THEME TOGGLE
// ========================================

function setTheme(theme) {

    document.documentElement.setAttribute(
        "data-theme",
        theme
    );

    themeToggle.textContent =
        theme === "dark" ? "☀️" : "🌙";

    localStorage.setItem("bullsTheme", theme);

}


// Зареждаме запазената тема

const savedTheme =
    localStorage.getItem("bullsTheme") || "light";

setTheme(savedTheme);


// Превключване на темата

themeToggle.addEventListener("click", function() {

    const currentTheme =
        document.documentElement.getAttribute("data-theme");

    const newTheme =
        currentTheme === "dark" ? "light" : "dark";

    setTheme(newTheme);

});


// ========================================
// 18. INITIALIZE GAME
// ========================================

updateBestScore();

startNewGame();