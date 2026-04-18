/**
 * Battle Tap - 2 Player Couple Game
 * One screen, two players. Simple and addictive.
 */

const p1Area = document.getElementById('p1-area');
const p2Area = document.getElementById('p2-area');
const message = document.getElementById('battle-message');
const p1ScoreDisplay = document.getElementById('p1-score');
const p2ScoreDisplay = document.getElementById('p2-score');

let p1Percentage = 50;
let isGameOver = false;

function updateDisplay() {
    p1Area.style.height = `${p1Percentage}%`;
    p2Area.style.height = `${100 - p1Percentage}%`;
}

function handleP1Tap(e) {
    if (isGameOver) return;
    e.preventDefault();
    p1Percentage += 2;
    checkWinner();
    updateDisplay();
}

function handleP2Tap(e) {
    if (isGameOver) return;
    e.preventDefault();
    p1Percentage -= 2;
    checkWinner();
    updateDisplay();
}

function checkWinner() {
    if (p1Percentage >= 100) {
        win('Player 1 (TOP)');
    } else if (p1Percentage <= 0) {
        win('Player 2 (BOTTOM)');
    }
}

function win(winner) {
    isGameOver = true;
    message.innerText = `${winner} WINS!`;
    message.parentElement.classList.remove('hidden');
    
    // Reward credits to the account
    let credits = parseInt(localStorage.getItem('neon_credits') || '0');
    credits += 50;
    localStorage.setItem('neon_credits', credits);
}

function resetGame() {
    p1Percentage = 50;
    isGameOver = false;
    message.parentElement.classList.add('hidden');
    updateDisplay();
}

// Touch Events for Mobile
p1Area.addEventListener('touchstart', handleP1Tap);
p2Area.addEventListener('touchstart', handleP2Tap);

// Click Events for PC test
p1Area.addEventListener('mousedown', handleP1Tap);
p2Area.addEventListener('mousedown', handleP2Tap);
