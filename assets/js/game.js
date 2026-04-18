/**
 * Neon Runner - Game Logic
 * Features: LocalStorage economy, increasing difficulty, and premium visuals.
 */

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startOverlay = document.getElementById('start-overlay');
const gameoverOverlay = document.getElementById('gameover-overlay');
const creditDisplay = document.getElementById('user-credits');
const highscoreDisplay = document.getElementById('user-highscore');
const finalScoreText = document.getElementById('final-score');
const creditsEarnedText = document.getElementById('credits-earned');

// Game State
let gameState = 'START'; // START, PLAYING, GAMEOVER
let score = 0;
let credits = parseInt(localStorage.getItem('neon_credits') || '0');
let highscore = parseInt(localStorage.getItem('neon_highscore') || '0');
let activeSkin = localStorage.getItem('neon_active_skin') || 'default';
let ownedSkins = JSON.parse(localStorage.getItem('neon_owned_skins') || '["default"]');

// Game Config
let player, obstacles, animationId, frameCount;
let difficultyMultiplier = 1;

// Initialize Displays
updateStats();

function updateStats() {
    creditDisplay.innerText = credits.toLocaleString();
    highscoreDisplay.innerText = highscore.toLocaleString();
}

class Player {
    constructor() {
        this.width = 40;
        this.height = 40;
        this.x = 50;
        this.y = canvas.height - this.height - 20;
        this.vy = 0;
        this.gravity = 0.8;
        this.jumpStrength = -15;
        this.isJumping = false;
        this.color = getSkinColor(activeSkin);
    }

    draw() {
        ctx.save();
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;
        
        // Draw player with a slight pulse
        const pulse = Math.sin(frameCount / 10) * 2;
        ctx.fillRect(this.x, this.y - pulse/2, this.width, this.height + pulse);
        
        // Inner light
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillRect(this.x + 5, this.y + 5, 10, 10);
        ctx.restore();
    }

    update() {
        this.vy += this.gravity;
        this.y += this.vy;

        if (this.y > canvas.height - this.height - 20) {
            this.y = canvas.height - this.height - 20;
            this.vy = 0;
            this.isJumping = false;
        }
    }

    jump() {
        if (!this.isJumping) {
            this.vy = this.jumpStrength;
            this.isJumping = true;
        }
    }
}

class Obstacle {
    constructor() {
        this.width = 30 + Math.random() * 30;
        this.height = 40 + Math.random() * 60;
        this.x = canvas.width;
        this.y = canvas.height - this.height - 20;
        this.speed = (5 + difficultyMultiplier) * (0.8 + Math.random() * 0.4);
        this.color = '#ff00c8';
    }

    draw() {
        ctx.save();
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.restore();
    }

    update() {
        this.x -= this.speed;
    }
}

function getSkinColor(skin) {
    switch(skin) {
        case 'neon': return '#00f2ff';
        case 'gold': return '#ffd700';
        case 'phantom': return 'rgba(255, 255, 255, 0.3)';
        default: return '#7000ff';
    }
}

function resizeCanvas() {
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function startGame() {
    gameState = 'PLAYING';
    score = 0;
    difficultyMultiplier = 1;
    frameCount = 0;
    player = new Player();
    obstacles = [];
    
    startOverlay.classList.add('hidden');
    gameoverOverlay.classList.add('hidden');
    
    gameLoop();
}

function gameLoop() {
    if (gameState !== 'PLAYING') return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frameCount++;

    // Ground line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - 20);
    ctx.lineTo(canvas.width, canvas.height - 20);
    ctx.stroke();

    player.update();
    player.draw();

    // Difficulty scaling
    if (frameCount % 500 === 0) difficultyMultiplier += 0.2;

    // Obstacle spawning
    if (frameCount % Math.max(20, Math.floor(80 / difficultyMultiplier)) === 0) {
        if (Math.random() > 0.5) obstacles.push(new Obstacle());
    }

    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].update();
        obstacles[i].draw();

        // Collision detection
        if (
            player.x < obstacles[i].x + obstacles[i].width &&
            player.x + player.width > obstacles[i].x &&
            player.y < obstacles[i].y + obstacles[i].height &&
            player.y + player.height > obstacles[i].y
        ) {
            endGame();
        }

        // Score and removal
        if (obstacles[i].x + obstacles[i].width < 0) {
            obstacles.splice(i, 1);
            score += 10;
        }
    }

    // Draw Score
    ctx.fillStyle = 'white';
    ctx.font = 'bold 24px Outfit';
    ctx.textAlign = 'right';
    ctx.fillText(`SCORE: ${score}`, canvas.width - 30, 50);

    animationId = requestAnimationFrame(gameLoop);
}

function endGame() {
    gameState = 'GAMEOVER';
    cancelAnimationFrame(animationId);
    
    const earnedCredits = Math.floor(score / 5);
    credits += earnedCredits;
    
    if (score > highscore) {
        highscore = score;
        localStorage.setItem('neon_highscore', highscore);
    }
    
    localStorage.setItem('neon_credits', credits);
    
    finalScoreText.innerText = `Score: ${score}`;
    creditsEarnedText.innerText = `+${earnedCredits} Credits Earned`;
    
    updateStats();
    gameoverOverlay.classList.remove('hidden');
}

function showShop() {
    document.getElementById('shop-section').scrollIntoView({ behavior: 'smooth' });
}

function selectSkin(skin, price) {
    if (ownedSkins.includes(skin)) {
        activeSkin = skin;
        localStorage.setItem('neon_active_skin', skin);
        alert(`Skin "${skin}" selected!`);
        location.reload(); // Refresh to apply skin to UI if needed
    } else {
        if (credits >= price) {
            if (confirm(`Buy "${skin}" for ${price} credits?`)) {
                credits -= price;
                ownedSkins.push(skin);
                activeSkin = skin;
                localStorage.setItem('neon_credits', credits);
                localStorage.setItem('neon_owned_skins', JSON.stringify(ownedSkins));
                localStorage.setItem('neon_active_skin', skin);
                updateStats();
                alert('Purchase successful!');
                location.reload();
            }
        } else {
            alert('Not enough credits!');
        }
    }
}

// Controls
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
        if (gameState === 'PLAYING') player.jump();
        if (gameState === 'START') startGame();
    }
});

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (gameState === 'PLAYING') player.jump();
    if (gameState === 'START') startGame();
});
