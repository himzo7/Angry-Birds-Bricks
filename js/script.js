var canvas;
var ctx;
var WIDTH = 600;
var HEIGHT = 500;
var x;
var y;
var dx;
var dy;
var r = 14;

var paddlex;
var paddlew = 120;
var paddleh = 14;
var rightDown = false;
var leftDown = false;

var gameRunning = false;
var intervalId;
var timerInterval;
var score = 0;
var seconds = 0;
var highscore = localStorage.getItem("highscore");
if (highscore == null) {
    highscore = 0;
}

var level = 1;

var pigs;
var NROWS = 3;
var NCOLS = 6;
var BRICKWIDTH;
var BRICKHEIGHT = 35;
var PADDING = 10;

var hitCooldown = 0;
var HIT_COOLDOWN_MAX = 15;

var bird = new Image();
bird.src = "https://cdn-icons-png.flaticon.com/512/528/528076.png";
var pig = new Image();
pig.src = "assets/pigs.png";

function setLevel(selectedLevel) {
    level = selectedLevel;
    if (level == 1) {
        NROWS = 3;
        NCOLS = 6;
        document.getElementById("selected-level").innerHTML = "Easy selected";
        document.getElementById("level-text").innerHTML = "Easy";
    }
    if (level == 2) {
        NROWS = 4;
        NCOLS = 8;
        document.getElementById("selected-level").innerHTML = "Medium selected";
        document.getElementById("level-text").innerHTML = "Medium";
    }
    if (level == 3) {
        NROWS = 5;
        NCOLS = 10;
        document.getElementById("selected-level").innerHTML = "Hard selected";
        document.getElementById("level-text").innerHTML = "Hard";
    }
    document.getElementById("start-button").disabled = false;
}

function startFromMenu() {
    document.getElementById("welcome-screen").style.display = "none";
    document.getElementById("game-wrapper").style.display = "flex";
    init();
}

function init() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    paddlex = WIDTH / 2 - paddlew / 2;
    x = WIDTH / 2;
    y = HEIGHT - 80;
    dx = 4;
    dy = -5;
    score = 0;
    seconds = 0;
    hitCooldown = 0;
    document.getElementById("score").innerHTML = score;
    document.getElementById("time").innerHTML = "00:00";
    document.getElementById("highscore").innerHTML = highscore;
    initPigs();
    draw();
}

function initPigs() {
    BRICKWIDTH = (WIDTH / NCOLS) - PADDING;
    pigs = new Array(NROWS);
    for (var i = 0; i < NROWS; i++) {
        pigs[i] = new Array(NCOLS);
        for (var j = 0; j < NCOLS; j++) {
            pigs[i][j] = 1;
        }
    }
    if (level >= 2) {
        pigs[0][1] = 2;
        pigs[0][4] = 2;
        pigs[1][2] = 2;
        pigs[1][5] = 2;
        pigs[2][0] = 2;
        pigs[2][3] = 2;
        pigs[2][6] = 2;
        pigs[3][1] = 2;
        pigs[3][4] = 2;
    }
    if (level == 3) {
        pigs[0][2] = 3;
        pigs[0][7] = 3;
        pigs[1][4] = 3;
        pigs[2][1] = 3;
        pigs[2][8] = 3;
        pigs[3][5] = 3;
        pigs[4][2] = 3;
        pigs[4][7] = 3;
    }
}

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

function keyDown(e) {
    if (e.keyCode == 39) {
        rightDown = true;
    } else if (e.keyCode == 37) {
        leftDown = true;
    }
}

function keyUp(e) {
    if (e.keyCode == 39) {
        rightDown = false;
    } else if (e.keyCode == 37) {
        leftDown = false;
    }
}

function updateTimer() {
    if (gameRunning == true) {
        seconds++;
        var minutes = Math.floor(seconds / 60);
        var secs = seconds % 60;
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        if (secs < 10) {
            secs = "0" + secs;
        }
        document.getElementById("time").innerHTML = minutes + ":" + secs;
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

function drawBackground() {
    var gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
    gradient.addColorStop(0, "#4EC0E0");
    gradient.addColorStop(1, "#A1E4F5");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
}

function drawPaddle() {
    ctx.fillStyle = "#8B4513";
    ctx.fillRect(
        paddlex,
        HEIGHT - paddleh - 5,
        paddlew,
        paddleh
    );
}

function drawBird() {
    ctx.drawImage(
        bird,
        x - r,
        y - r,
        r * 2,
        r * 2
    );
}

function drawPigs() {
    for (var i = 0; i < NROWS; i++) {
        for (var j = 0; j < NCOLS; j++) {
            if (pigs[i][j] > 0) {
                var brickX = (j * (BRICKWIDTH + PADDING)) + PADDING / 2;
                var brickY = (i * (BRICKHEIGHT + PADDING)) + 50;
                ctx.save();
                if (pigs[i][j] == 2) {
                    ctx.filter = "brightness(0.45) sepia(1) hue-rotate(100deg)";
                }
                if (pigs[i][j] == 3) {
                    ctx.filter = "hue-rotate(250deg) saturate(2.5)";
                }
                ctx.drawImage(pig, brickX, brickY, BRICKWIDTH, BRICKHEIGHT);
                ctx.restore();
            }
        }
    }
}

function checkCollision() {
    if (hitCooldown > 0) {
        hitCooldown--;
        return;
    }
    var rowheight = BRICKHEIGHT + PADDING;
    var colwidth = BRICKWIDTH + PADDING;
    var row = Math.floor((y - 50) / rowheight);
    var col = Math.floor(x / colwidth);
    if (
        y < NROWS * rowheight + 50 &&
        row >= 0 &&
        col >= 0 &&
        row < NROWS &&
        col < NCOLS &&
        pigs[row][col] > 0
    ) {
        dy = -dy;
        pigs[row][col]--;
        hitCooldown = HIT_COOLDOWN_MAX;
        if (pigs[row][col] == 0) {
            score += 10;
            document.getElementById("score").innerHTML = score;
        }
    }
}

function moveBall() {
    if (x + dx > WIDTH - r || x + dx < r) {
        dx = -dx;
    }
    if (y + dy < r) {
        dy = -dy;
    }
    else if (y + dy > HEIGHT - r - paddleh - 5) {
        if (x > paddlex && x < paddlex + paddlew) {
            dx = 8 * ((x - (paddlex + paddlew / 2)) / paddlew);
            dy = -dy;
        } else if (y + dy > HEIGHT - r) {
            endGame(false);
        }
    }
    x += dx;
    y += dy;
}

function movePaddle() {
    if (rightDown) {
        if (paddlex + paddlew < WIDTH) {
            paddlex += 7;
        }
    } else if (leftDown) {
        if (paddlex > 0) {
            paddlex -= 7;
        }
    }
}

function checkWin() {
    var remaining = 0;
    for (var i = 0; i < NROWS; i++) {
        for (var j = 0; j < NCOLS; j++) {
            if (pigs[i][j] > 0) {
                remaining++;
            }
        }
    }
    if (remaining == 0) {
        endGame(true);
    }
}

function draw() {
    clearCanvas();
    drawBackground();
    movePaddle();
    drawPaddle();
    drawBird();
    drawPigs();
    checkCollision();
    moveBall();
    checkWin();
}

function startGame() {
    if (gameRunning == false) {
        gameRunning = true;
        intervalId = setInterval(draw, 10);
        timerInterval = setInterval(updateTimer, 1000);
    }
}

function pauseGame() {
    gameRunning = false;
    clearInterval(intervalId);
    clearInterval(timerInterval);
}

function resetGame() {
    pauseGame();
    init();
}

function endGame(win) {
    pauseGame();
    if (score > highscore) {
        highscore = score;
        localStorage.setItem("highscore", highscore);
    }
    document.getElementById("final-time").innerHTML =
        document.getElementById("time").innerHTML;
    document.getElementById("final-score").innerHTML = score;
    document.getElementById("final-highscore").innerHTML = highscore;
    if (win == true) {
        document.getElementById("game-over-title").innerHTML = "YOU WIN!";
    } else {
        document.getElementById("game-over-title").innerHTML = "GAME OVER!";
    }
    document.getElementById("game-over").style.display = "flex";
}

function backToMenu() {
    document.getElementById("game-over").style.display = "none";
    document.getElementById("game-wrapper").style.display = "none";
    document.getElementById("welcome-screen").style.display = "flex";
}
