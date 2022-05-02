const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = 900;
canvas.height = 600;
let canvasPosition = canvas.getBoundingClientRect();
const cellSize = 100;
const cellGap = 3;
const gameGrid = [];
let level = 0;
let numberOfResources = levelData[level].numberOfResources;
let frame = 0;
let enemiesToSpawn = levelData[level].enemiesToSpawn;
let enemiesInterval = levelData[level].enemiesInterval;
let gameOver = false;
let score = 0;

const mouse = {
  x: undefined,
  y: undefined,
  width: 0.1,
  height: 0.1,
  clicked: false,
};

canvas.addEventListener("mousedown", function () {
  mouse.clicked = true;
});

canvas.addEventListener("mouseup", function () {
  mouse.clicked = false;
});

canvas.addEventListener("mousemove", function (e) {
  mouse.x = e.x - canvasPosition.left;
  mouse.y = e.y - canvasPosition.top;
});

canvas.addEventListener("mouseleave", function () {
  mouse.x = undefined;
  mouse.y = undefined;
});

class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = cellSize;
    this.height = cellSize;
  }
  draw() {
    ctx.strokeStyle = "darkgreen";
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    if (mouse.x && mouse.y && collision(this, mouse)) {
      ctx.strokeStyle = "blue";
      ctx.globalAlpha = 0.2;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    ctx.globalAlpha = 1;
  }
}

function createGrid() {
  for (let y = cellSize; y < canvas.height; y += cellSize) {
    for (let x = 0; x < canvas.width; x += cellSize) {
      gameGrid.push(new Cell(x, y));
    }
  }
}

function handleGameGrid() {
  for (let i = 0; i < gameGrid.length; i++) {
    gameGrid[i].draw();
  }
}

canvas.addEventListener("click", function () {
  const gridPositionX = mouse.x - (mouse.x % cellSize) + cellGap;
  const gridPositionY = mouse.y - (mouse.y % cellSize) + cellGap;
  if (gridPositionY < cellSize) {
    return;
  }
  for (let i = 0; i < defenders.length; i++) {
    if (defenders[i].x === gridPositionX && defenders[i].y === gridPositionY)
      return;
  }
  if (numberOfResources >= defenderCost) {
    defenders.push(new Defender(gridPositionX, gridPositionY));
    numberOfResources -= defenderCost;
  } else {
    floatingMessages.push(
      new FloatingMessage(
        "More Resources Required",
        mouse.x,
        mouse.y,
        12,
        "red"
      )
    );
  }
});
//utilities
function handleGameStatus(gameComplete) {
  if (!gameComplete) {
    ctx.fillStyle = "gold";
    ctx.font = "30px Arial";
    ctx.fillText("Score: " + score, 180, 40);
    ctx.fillText("Resources: " + numberOfResources, 180, 80);
  }
  if (enemiesToSpawn <= spawnedEnemies && enemies.length === 0) {
    ctx.fillStyle = "blue";
    ctx.font = "60px Arial";
    ctx.fillText("Level Complete!", 300, 300);
    gameOver = true;
  } else if (gameOver) {
    ctx.fillStyle = "black";
    ctx.font = "90px Arial";
    ctx.fillText("GAME OVER", 135, 330);
  }
}
const controlsBar = {
  width: canvas.width,
  height: cellSize,
};
createGrid();
animate();
function animate() {
  const background = new Image();
  background.src = "./images/battleground.png";
  ctx.drawImage(background, 0, 0, 900, 600);
  ctx.fillStyle = "darkgreen";
  ctx.fillRect(0, 0, controlsBar.width, controlsBar.height);
  handleGameGrid();
  chooseDefender();
  handleDefenders();
  handleProjectiles();
  handleEnemies();
  handleResources();
  handleGameStatus(false);
  handleFloatingMessages();
  frame++;
  if (!gameOver) {
    requestAnimationFrame(animate);
  } else {
    levelOverScreen();
    handleGameStatus(true);
  }
}
function collision(first, second) {
  if (
    !(
      first.x > second.x + second.width ||
      first.x + first.width < second.x ||
      first.y > second.y + second.height ||
      first.y + first.height < second.y
    )
  ) {
    return true;
  }
  return false;
}
window.addEventListener("resize", function () {
  canvasPosition = canvas.getBoundingClientRect();
});
