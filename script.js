const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = 900;
canvas.height = 600;

//global variables
const cellSize = 100;
const cellGap = 3;
const gameGrid = [];
const defenders = [];
let numberOfResources = 300;
const enemies = [];
let frame = 0;
const enemyPosition = [];
let enemiesToSpawn = 3;
let enemiesInterval = 600;
let gameOver = false;
let level = 1;
const projectiles = [];
let score = 0;
const resources = [];
const winningScore = 200;
let chosenDefender = 0;
//mouse
const mouse = {
  x: undefined,
  y: undefined,
  width: 0.1,
  height: 0.1,
  clicked: false,
};
let canvasPosition = canvas.getBoundingClientRect();
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
//game board
const controlsBar = {
  width: canvas.width,
  height: cellSize,
};
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
createGrid();
function handleGameGrid() {
  for (let i = 0; i < gameGrid.length; i++) {
    gameGrid[i].draw();
  }
}
//projectiles
const projectileTypes = [];
const projectile1 = new Image();
projectile1.src = "./images/towerProjectile.png";
projectileTypes.push(projectile1);
class Projectiles {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 10;
    this.height = 10;
    this.power = 20;
    this.speed = 5;
    this.projectileType = projectileTypes[0];
    this.frameX = 0; // to cycle through frames for animation (Dont currently have any)
    this.frameY = 0; // same as above
    this.minFrame = 0; //also cycles
    this.maxFrame = 4; //^^
    this.spriteWidth = 62;
    this.spriteHeight = 57;
  }
  update() {
    this.x += this.speed;
    //if (frame % 10 === 0 ){
    // if (this.frameX < this.maxFrame){this.frameX++;}
    //else {this.frameX = this.minFrame;}
    //}
  }
  draw() {
    ctx.drawImage(
      this.projectileType,
      this.frameX * this.spriteWidth,
      this.frameY * this.spriteHeight,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.width + 10,
      this.height + 10
    );
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.width, 0, Math.PI * 2);
  }
}
function handleProjectiles() {
  for (let i = 0; i < projectiles.length; i++) {
    projectiles[i].update();
    projectiles[i].draw();

    for (let j = 0; j < enemies.length; j++) {
      if (
        enemies[j] &&
        projectiles[i] &&
        collision(projectiles[i], enemies[j])
      ) {
        enemies[j].health -= projectiles[i].power;
        projectiles.splice(i, 1);
        i--;
      }
    }

    if (projectiles[i] && projectiles[i].x > canvas.width - cellSize) {
      projectiles.splice(i, 1);
      i--;
    }
  }
}
//defenders/ towers
const defenderTypes = [];
const defender1 = new Image();
defender1.src = "./images/tower1.png";
defenderTypes.push(defender1);
const defender2 = new Image();
defender2.src = "./images/tower2.png";
defenderTypes.push(defender2);
const defender3 = new Image();
defender3.src = "./images/tower3.png";
defenderTypes.push(defender3);
class Defender {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = cellSize - cellGap * 2;
    this.height = cellSize - cellGap * 2;
    this.shooting = false;
    this.health = 100;
    this.projectiles = [];
    this.timer = 0;
    this.fireRate = 100;
    this.defenderType = defenderTypes[chosenDefender];
    this.frameX = 0; // to cycle through frames for animation (Dont currently have any)
    this.frameY = 0; // same as above
    this.minFrame = 0; //also cycles
    this.maxFrame = 5; //^^
    this.spriteWidth = 164;
    this.spriteHeight = 195;
  }
  draw() {
    ctx.fillStyle = "lightgreen";
    ctx.font = "15px Arial";
    ctx.fillText(Math.floor(this.health), this.x + 30, this.y + 15);
    ctx.drawImage(
      this.defenderType,
      this.frameX * this.spriteWidth,
      this.frameY * this.spriteHeight,
      this.spriteWidth,
      this.spriteHeight,
      this.x + 10,
      this.y,
      this.width - 20,
      this.height
    );
  }
  update() {
    if (this.shooting) {
      if (this.timer % this.fireRate === 0 || this.timer === 0) {
        projectiles.push(new Projectiles(this.x + 50, this.y + 50));
      }
      this.timer++;
    } else {
      this.timer = 0;
    }
    //if (frame % 10 === 0 ){
    // if (this.frameX < this.maxFrame){this.frameX++;}
    //else {this.frameX = this.minFrame;}
    //}
  }
}
const card1 = {
  x: 10,
  y: 10,
  width: 70,
  height: 85,
  color: "gold",
};
const card2 = {
  x: 90,
  y: 10,
  width: 70,
  height: 85,
  color: "black",
};
function chooseDefender() {
  if (collision(mouse, card1) && mouse.clicked) {
    chosenDefender = 0;
  } else if (collision(mouse, card2) && mouse.clicked) {
    chosenDefender = 1;
  }
  if (chosenDefender === 0) {
    card1.color = "gold";
    card2.color = "black";
  } else if (chosenDefender === 1) {
    card2.color = "gold";
    card1.color = "black";
  }
  ctx.lineWidth = 2;
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(card1.x, card1.y, card1.width, card1.height);
  ctx.strokeStyle = card1.color;
  ctx.strokeRect(card1.x, card1.y, card1.width, card1.height);
  ctx.drawImage(
    defender1,
    0,
    0,
    164,
    187,
    20,
    15,
    card1.width * 0.8,
    card1.height * 0.8
  );
  ctx.fillRect(card2.x, card2.y, card2.width, card2.height);
  ctx.strokeStyle = card2.color;
  ctx.strokeRect(card2.x, card2.y, card2.width, card2.height);
  ctx.drawImage(
    defender2,
    0,
    0,
    164,
    187,
    100,
    15,
    card2.width * 0.8,
    card2.height * 0.8
  );
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
  let defenderCost = 100;
  if (numberOfResources >= defenderCost) {
    defenders.push(new Defender(gridPositionX, gridPositionY));
    numberOfResources -= defenderCost;
  } else {
    floatingMessages.push(
      new FloatingMessage(
        "More Resources Required",
        mouse.x,
        mouse.y,
        15,
        "red"
      )
    );
  }
});
function handleDefenders() {
  for (let i = 0; i < defenders.length; i++) {
    defenders[i].draw();
    defenders[i].update();
    if (enemyPosition.indexOf(defenders[i].y) !== -1) {
      defenders[i].shooting = true;
    } else {
      defenders[i].shooting = false;
    }
    for (let j = 0; j < enemies.length; j++) {
      if (defenders[i] && collision(defenders[i], enemies[j])) {
        enemies[j].movement = 0;
        defenders[i].health -= 0.2;
      }
      if (defenders[i] && defenders[i].health <= 0) {
        defenders.splice(i, 1);
        i--;
        enemies[j].movement = enemies[j].speed;
      }
    }
  }
}
//floating messages
const floatingMessages = [];
class FloatingMessage {
  constructor(value, x, y, size, color) {
    this.value = value;
    this.x = x;
    this.y = y;
    this.size = size;
    this.lifeSpan = 0;
    this.color = color;
    this.opacity = 1;
  }
  update() {
    this.y -= 0.3;
    this.lifeSpan += 1;
    if (this.opacity > 0.02) {
      this.opacity -= 0.02;
    }
  }
  draw() {
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.font = this.size + "px Arial";
    ctx.fillText(this.value, this.x, this.y);
    ctx.globalAlpha = 1;
  }
}
function handleFloatingMessages() {
  for (let i = 0; i < floatingMessages.length; i++) {
    floatingMessages[i].update();
    floatingMessages[i].draw();
    if (floatingMessages[i].lifeSpan >= 50) {
      floatingMessages.splice(i, 1);
      i--;
    }
  }
}
//enemies
const enemySprites = [];
for (let i = 0; i < 11; i++) {
  let enemySprite = new Image();
  enemySprite.src = "./images/Goblin/Running/0_Goblin_Running_" + i + ".png";
  enemySprites.push(enemySprite);
}
class Enemy {
  constructor(verticalPosition) {
    this.x = canvas.width;
    this.y = verticalPosition;
    this.width = cellSize - cellGap * 2;
    this.height = cellSize - cellGap * 2;
    this.speed = Math.random() * 0.2 + 0.4;
    this.movement = this.speed;
    this.health = 100;
    this.maxHealth = this.health;
    this.frameX = 0;
    this.frameY = 0;
    this.minFrame = 0;
    this.maxFrame = 10;
  }
  update() {
    if (frame % 10 === 0) {
      if (this.frameX < this.maxFrame) {
        this.frameX++;
      } else {
        this.frameX = this.minFrame;
      }
    }
    this.x -= this.movement;
  }
  draw() {
    ctx.drawImage(
      enemySprites[this.frameX],
      this.x - 30,
      this.y,
      this.width,
      this.height
    );

    ctx.fillStyle = "darkred";
    ctx.font = "20px Arial";
    ctx.fillText(Math.floor(this.health), this.x, this.y + 20);
  }
}
let spawnedEnemies = 1;
function handleEnemies() {
  for (let i = 0; i < enemies.length; i++) {
    enemies[i].update();
    enemies[i].draw();
    if (enemies[i].x < 0) {
      gameOver = true;
    }
    if (enemies[i].health <= 0) {
      const gainedResources = enemies[i].maxHealth / 10;
      numberOfResources += gainedResources;
      floatingMessages.push(
        new FloatingMessage("+" + gainedResources, 250, 50, 30, "gold")
      );
      score += gainedResources;
      enemyPosition.splice(enemyPosition.indexOf(enemies[i].y), 1);
      enemies.splice(i, 1);
      i--;
    }
  }
  if (frame % enemiesInterval === 0 && spawnedEnemies <= enemiesToSpawn) {
    let verticalPosition =
      Math.floor(Math.random() * 5 + 1) * cellSize + cellGap;
    enemies.push(new Enemy(verticalPosition));
    enemyPosition.push(verticalPosition);
    spawnedEnemies++;
    if (enemiesInterval > 120) {
      enemiesInterval -= 50;
    }
  }
}
//resources
const coinSprites = [];
for (let i = 1; i < 11; i++) {
  let coinSprite = new Image();
  coinSprite.src = "./images/Gold_" + i + ".png";
  coinSprites.push(coinSprite);
}
const amounts = [20, 30, 40];
class Resource {
  constructor() {
    this.x = Math.random() * (canvas.width - cellSize);
    this.y = (Math.floor(Math.random() * 5) + 1) * cellSize + 25;
    this.width = cellSize * 0.4;
    this.height = cellSize * 0.4;
    this.amount = amounts[Math.floor(Math.random() * amounts.length)];
    this.frameX = 0;
    this.frameY = 0;
    this.minFrame = 0;
    this.maxFrame = 9;
  }
  draw() {
    ctx.drawImage(
      coinSprites[this.frameX],
      this.x,
      this.y,
      coinSprites[this.frameX].width / 15,
      this.height
    );
    ctx.fillStyle = "yellow";
    ctx.font = "20px Arial";
    ctx.fillText(this.amount, this.x - 5, this.y);
  }
  update() {
    if (frame % 10 === 0) {
      if (this.frameX < this.maxFrame) {
        this.frameX++;
      } else {
        this.frameX = this.minFrame;
      }
    }
  }
}
function handleResources() {
  if (frame % 500 === 0 && score < winningScore) {
    resources.push(new Resource());
  }
  for (let i = 0; i < resources.length; i++) {
    resources[i].draw();
    resources[i].update();
    if (resources[i] && mouse.x && mouse.y && collision(resources[i], mouse)) {
      numberOfResources += resources[i].amount;
      floatingMessages.push(
        new FloatingMessage(
          "+" + resources[i].amount,
          resources[i].x,
          resources[i].y,
          30,
          "gold"
        )
      );
      floatingMessages.push(
        new FloatingMessage("+" + resources[i].amount, 250, 50, 30, "gold")
      );
      resources.splice(i, 1);
      i--;
    }
  }
}
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
function levelOverScreen() {
  ctx.fillStyle = "green";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
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
animate();
window.addEventListener("resize", function () {
  canvasPosition = canvas.getBoundingClientRect();
});
