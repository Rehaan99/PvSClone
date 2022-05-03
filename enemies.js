const enemySprites = [];
const enemyPosition = [];
const enemies = [];
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
    this.speed = Math.random() * 0.2 + 0.8;
    this.movement = this.speed;
    this.health = 100;
    this.maxHealth = this.health;
    this.damage = 0.2;
    this.frameX = 0;
    this.frameY = 0;
    this.minFrame = 0;
    this.maxFrame = 10;
  }
  update() {
    if (frame % 5 === 0) {
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
let spawnedEnemies = 0;
function handleEnemies() {
  for (let i = 0; i < enemies.length; i++) {
    enemies[i].update();
    enemies[i].draw();
    if (enemies[i].x < 0 && gameStarted) {
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
  if (
    frame % enemiesInterval === 0 &&
    spawnedEnemies < enemiesToSpawn &&
    (frame > 0 || !gameStarted)
  ) {
    let verticalPosition =
      Math.floor(Math.random() * 5 + 1) * cellSize + cellGap;
    enemies.push(new Enemy(verticalPosition));
    enemyPosition.push(verticalPosition);
    if (enemiesInterval >= 1000 && gameStarted) {
      enemiesInterval = levelData[level].enemiesInterval;
    }
    if (gameStarted && !hordeMode) {
      spawnedEnemies++;
      if (enemiesInterval > 120) {
        enemiesInterval -= 50;
      }
    }
  }
}
