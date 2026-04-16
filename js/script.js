// --- VARIABLES ---
var ctx, canvas, intervalId, timerIntervalId;
var WIDTH = 600;
var HEIGHT = 500;

// Bird
var x, y, dx, dy;
var r = 14;
var bird = new Image();
bird.src = "https://cdn-icons-png.flaticon.com/512/528/528076.png";

// Paddle
var paddlex, paddleh = 12, paddlew = 110;
var rightDown = false;
var leftDown = false;

// Pigs (Bricks)
var pigs;
var NROWS, NCOLS;
var BRICKWIDTH, BRICKHEIGHT, PADDING = 10;
var pigImage = new Image();
pigImage.src = "assets/pigs.png";

// Game State
var gameRunning = false;
var score = 0, gold = 0, seconds = 0;
var difficulty = "";
var coins = [];
var fireballActive = false, fireballCount = 0;
var mirrorActive = false;

// High Score
var highScore = localStorage.getItem("angryBricksRecord");
if (highScore === null) highScore = 0;

// --- INITIALIZATION ---
function setDifficulty(lvl) {
    difficulty = lvl;
    var labels = { easy: "🟢 Easy", medium: "🟡 Medium", hard: "🔴 Hard" };
    document.getElementById("diff-chosen").textContent = "Selected: " + labels[lvl];
    document.getElementById("welcome-start-btn").disabled = false;

    if (lvl === 'easy')   { NROWS = 3; NCOLS = 6; }
    if (lvl === 'medium') { NROWS = 4; NCOLS = 8; }
    if (lvl === 'hard')   { NROWS = 5; NCOLS = 10; }
}

function startFromWelcome() {
    document.getElementById("welcome-screen").style.display = "none";
    document.getElementById("game-wrapper").style.display = "flex";
    
    var labels = { easy: "Easy", medium: "Medium", hard: "Hard" };
    document.getElementById("diff-label").textContent = labels[difficulty];
    document.getElementById("start-btn").disabled = false;
    
    init();
}

function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext("2d");

    paddlex = (WIDTH / 2) - (paddlew / 2);
    x = WIDTH / 2;
    y = HEIGHT - 60;
    dx = 2.5; 
    dy = -4.5;

    initPigs();
    drawStatic();
}

function initPigs() {
    BRICKWIDTH = (WIDTH / NCOLS) - PADDING;
    BRICKHEIGHT = 32; 
    
    pigs = new Array(NROWS);
    for (var i = 0; i < NROWS; i++) {
        pigs[i] = new Array(NCOLS);
        for (var j = 0; j < NCOLS; j++) {
            pigs[i][j] = 1; 
        }
    }

    var totalBricks = NROWS * NCOLS;
    if (difficulty === 'medium') {
        placeRandomPigs(2, Math.floor(totalBricks * 0.25));
    }
    if (difficulty === 'hard') {
        placeRandomPigs(3, Math.floor(totalBricks * 0.20));
        placeRandomPigs(2, Math.floor(totalBricks * 0.25));
    }
}

function placeRandomPigs(hp, count) {
    var placed = 0;
    var tries = 0;
    while (placed < count && tries < 1000) {
        tries++;
        var ri = Math.floor(Math.random() * NROWS);
        var rj = Math.floor(Math.random() * NCOLS);
        if (pigs[ri][rj] < hp) {  
            pigs[ri][rj] = hp;
            placed++;
        }
    }
}

// --- DRAWING HELPERS ---
function clear() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

function rect(x, y, w, h) {
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.closePath();
    ctx.fill();
}

function circle(x, y, rad) {
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
}

function drawBackground() {
    var gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
    gradient.addColorStop(0, "#4EC0E0");
    gradient.addColorStop(1, "#A1E4F5");
    ctx.fillStyle = gradient;
    rect(0, 0, WIDTH, HEIGHT);

    ctx.fillStyle = "#FFCD3C";
    circle(520, 70, 35);
}

// --- CONTROLS ---
function onKeyDown(evt) {
    if (evt.keyCode == 39) rightDown = true;
    else if (evt.keyCode == 37) leftDown = true;
}

function onKeyUp(evt) {
    if (evt.keyCode == 39) rightDown = false;
    else if (evt.keyCode == 37) leftDown = false;
}

document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);


// --- MAIN LOOP ---
function drawStatic() {
    clear();
    drawBackground();
    
    ctx.fillStyle = "#8B4513";
    rect(paddlex, HEIGHT - paddleh - 5, paddlew, paddleh);
    
    ctx.drawImage(bird, x - r, y - r, 2 * r, 2 * r);
    
    drawAllPigs();
}

function drawAllPigs() {
    for (var i = 0; i < NROWS; i++) {
        for (var j = 0; j < NCOLS; j++) {
            if (pigs[i][j] > 0) {
                var bx = (j * (BRICKWIDTH + PADDING)) + PADDING / 2;
                var by = (i * (BRICKHEIGHT + PADDING)) + 50;
                
                ctx.save();
                if (pigs[i][j] === 3) ctx.filter = "hue-rotate(250deg) saturate(2.5) brightness(1.1)";
                else if (pigs[i][j] === 2) ctx.filter = "brightness(0.45) sepia(1) hue-rotate(100deg)";
                ctx.drawImage(pigImage, bx, by, BRICKWIDTH, BRICKHEIGHT);
                ctx.restore();
            }
        }
    }
}

function draw() {
    if (!gameRunning) return;
    clear();
    drawBackground();

    if (rightDown) {
        if ((paddlex + paddlew) < WIDTH) paddlex += 7;
        else paddlex = WIDTH - paddlew;
    } else if (leftDown) {
        if (paddlex > 0) paddlex -= 7;
        else paddlex = 0;
    }

    ctx.fillStyle = "#8B4513";
    rect(paddlex, HEIGHT - paddleh - 5, paddlew, paddleh);
    if (mirrorActive) rect(paddlex, 5, paddlew, paddleh);

    var remainingPigs = 0;

    for (var i = 0; i < NROWS; i++) {
        for (var j = 0; j < NCOLS; j++) {
            if (pigs[i][j] > 0) {
                remainingPigs++;
                var bx = (j * (BRICKWIDTH + PADDING)) + PADDING / 2;
                var by = (i * (BRICKHEIGHT + PADDING)) + 50;

                if (x + r > bx && x - r < bx + BRICKWIDTH && y + r > by && y - r < by + BRICKHEIGHT) {
                    if (!fireballActive) dy = -dy; 
                    else {
                        fireballCount--;
                        if (fireballCount <= 0) fireballActive = false;
                    }

                    pigs[i][j]--; 

                    if (pigs[i][j] === 0) {
                        score += 20;
                        document.getElementById("score").textContent = score;
                        coins.push({ kx: bx + BRICKWIDTH / 2, ky: by });
                        remainingPigs--;
                    }
                    break; 
                }

                ctx.save();
                if (pigs[i][j] === 3) ctx.filter = "hue-rotate(250deg) saturate(2.5) brightness(1.1)";
                else if (pigs[i][j] === 2) ctx.filter = "brightness(0.45) sepia(1) hue-rotate(100deg)";
                ctx.drawImage(pigImage, bx, by, BRICKWIDTH, BRICKHEIGHT);
                ctx.restore();
            }
        }
    }

    if (remainingPigs === 0) {
        showGameOver(true);
        return;
    }

    ctx.fillStyle = "#FFD700";
    for (var k = 0; k < coins.length; k++) {
        var c = coins[k];
        c.ky += 2.5; 
        circle(c.kx, c.ky, 8);

        if (c.ky > HEIGHT - 25 && c.kx > paddlex && c.kx < paddlex + paddlew) {
            gold += 10;
            document.getElementById("gold").textContent = gold;
            coins.splice(k, 1); 
            k--; 
        } else if (c.ky > HEIGHT) {
            coins.splice(k, 1);
            k--;
        }
    }

    if (fireballActive) {
        ctx.shadowColor = "orange";
        ctx.shadowBlur = 20;
    }
    ctx.drawImage(bird, x - r, y - r, 2 * r, 2 * r);
    ctx.shadowBlur = 0;

    if (x + dx > WIDTH - r || x + dx < r) dx = -dx;

    if (y + dy < r + (mirrorActive ? 20 : 0)) {
        if (mirrorActive && x > paddlex && x < paddlex + paddlew) dy = -dy; 
        else if (y + dy < r) dy = -dy; 
    }
    else if (y + dy > HEIGHT - r - paddleh - 5) {
        if (x > paddlex && x < paddlex + paddlew) {
            dx = 8 * ((x - (paddlex + paddlew / 2)) / paddlew);
            dy = -dy;
        } else if (y + dy > HEIGHT - r) {
            showGameOver(false);
            return;
        }
    }

    x += dx;
    y += dy;
}


// --- BUTTON FUNCTIONS & TIMERS ---
function updateTime() {
    if (gameRunning) {
        seconds++;
        var m = Math.floor(seconds / 60).toString().padStart(2, '0');
        var s = (seconds % 60).toString().padStart(2, '0');
        document.getElementById("time").textContent = m + ":" + s;
    }
}

function startGame() {
    if (!gameRunning) {
        gameRunning = true;
        if (!intervalId) intervalId = setInterval(draw, 10);
        if (!timerIntervalId) timerIntervalId = setInterval(updateTime, 1000);
    }
}

function pauseGame() {
    gameRunning = false;
    clearInterval(intervalId);
    intervalId = null;
    clearInterval(timerIntervalId);
    timerIntervalId = null;
}

function resetGame() {
    pauseGame();
    continueToMenu();
}

function showGameOver(isVictory) {
    pauseGame(); 

    if (score > highScore) {
        highScore = score;
        localStorage.setItem("angryBricksRecord", highScore);
    }

    var titleEl = document.getElementById("end-title");
    if (isVictory) {
        titleEl.textContent = "VICTORY!";
        titleEl.style.color = "#71c74d";
    } else {
        titleEl.textContent = "GAME OVER!";
        titleEl.style.color = "#e63946";
    }

    document.getElementById("end-time").textContent = document.getElementById("time").textContent;
    document.getElementById("end-score").textContent = score;
    document.getElementById("end-record").textContent = highScore;

    document.getElementById("game-over-modal").style.display = "flex";
}

function continueToMenu() {
    document.getElementById("game-over-modal").style.display = "none";
    document.getElementById("game-wrapper").style.display = "none";
    document.getElementById("welcome-screen").style.display = "flex";

    score = 0; gold = 0; seconds = 0;
    fireballActive = false; mirrorActive = false; coins = [];
    
    document.getElementById("score").textContent = score;
    document.getElementById("gold").textContent = gold;
    document.getElementById("time").textContent = "00:00";
    document.getElementById("start-btn").disabled = true;
}

// ---- AUTHOR INFO MODAL ----
function showAuthorInfo() {
    if (gameRunning) pauseGame();
    document.getElementById("author-modal").style.display = "flex";
}

function closeAuthorInfo() {
    document.getElementById("author-modal").style.display = "none";
}

// ---- SHOP ----
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("btn-fireball").addEventListener("click", function() {
        if (gold >= 30) {
            gold -= 30;
            fireballActive = true;
            fireballCount = 5;
            document.getElementById("gold").textContent = gold;
        }
    });

    document.getElementById("btn-mirror").addEventListener("click", function() {
        if (gold >= 100) {
            gold -= 100;
            mirrorActive = true;
            document.getElementById("gold").textContent = gold;
        }
    });
});