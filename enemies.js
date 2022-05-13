const enemySprites = [],
  enemyPosition = [],
  enemies = [],
  deadEnemies = [];
let spawnedEnemies = 0;

const calculateHealthBarColor = (health, maxHealth) => {
    const healthPercentage = health / maxHealth;

    if (healthPercentage > 0.8) {
        return "green";
    } else if (healthPercentage > 0.6) {
        return "yellow";
    } else if (healthPercentage > 0.4) {
        return "orange";
    } else {
        return "red";
    }
}

for (let i = 0; i < 12; i++) {
  let enemySprite = new Image();
  enemySprite.src = "./images/Goblin/Running/0_Goblin_Running_" + i + ".png";
  enemySprites.push(enemySprite);
}
for (let i = 0; i < 12; i++) {
  let enemySprite = new Image();
  enemySprite.src = "./images/Goblin/Dying/0_Goblin_Dying_" + i + ".png";
  enemySprites.push(enemySprite);
}
for (let i = 0; i < 12; i++) {
  let enemySprite = new Image();
  enemySprite.src = "./images/Goblin/Slashing/0_Goblin_Slashing_" + i + ".png";
  enemySprites.push(enemySprite);
}

class Enemy {
  healthbarWidth = 60;
  healthbarHeight = 6;
  drawHealthbar = drawHealthbar.bind(this);
  healthbarXOffset = -10;
  healthbarYOffset = 0;

  constructor(
    verticalPosition,
    x = canvas.width,
    speed = 1.2,
    health = 100,
    dead = false,
    damage = 0.2
  ) {
    this.x = x;
    this.y = verticalPosition;
    this.width = cellSize - cellGap * 2;
    this.height = cellSize - cellGap * 2;
    this.speed = Math.random() * 0.2 + speed;
    this.movement = this.speed;
    this.health = health;
    this.maxHealth = this.health;
    this.damage = damage;
    this.frameX = 0;
    this.frameY = 0;
    this.minFrame = 0;
    this.maxFrame = 11;
    this.dead = dead;
  }

  update() {
    if (frame % 5 === 0 || (this.dead && frame % 3 === 0)) {
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
      this.dead
        ? enemySprites[this.frameX + 12]
        : this.movement === 0
        ? enemySprites[this.frameX + 24]
        : enemySprites[this.frameX],
      this.x - 30,
      this.y,
      this.width,
      this.height
    );

    if (!this.dead) {
        this.drawHealthbar();
    }
  }
}

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
      deadEnemies.push(
        new Enemy(enemies[i].y, enemies[i].x, 0, enemies[i].health, true, 0)
      );
      enemies.splice(i, 1);
      i--;
    }
  }
  for (let i = 0; i < deadEnemies.length; i++) {
    deadEnemies[i].update();
    deadEnemies[i].draw();
    if (deadEnemies[i].frameX === deadEnemies[i].maxFrame) {
      deadEnemies.splice(i, 1);
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
    if (gameStarted && !hordeMode) {
      spawnedEnemies++;
    }
    if (enemiesInterval > 120) {
      enemiesInterval -= 50;
    }
  }
}
