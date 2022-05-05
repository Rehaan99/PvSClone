const defenderSpriteTypes = [];
const defenders = [];
let globalChosenDefender = 0;
const defenderTypes = [];
for (let i = 1; i < 4; i++) {
  const defenderSprite = new Image();
  defenderSprite.src = "./images/tower" + i + ".png";
  defenderSpriteTypes.push(defenderSprite);
  const positioning = {
    x: 10 + 80 * (i - 1),
    y: 10,
    width: 70,
    height: 85,
    chosenDefender: i - 1,
    isSelected: i === 1,
  };
  let defenderValues;
  switch (i) {
    case 2:
      defenderValues = {
        ...positioning,
        cost: 200,
        health: 40,
        fireRate: 50,
        hardness: 0,
        firingRange: 5,
        travelRange: 5,
        productionSpeed: 0,
        production: false,
        damage: 50,
        description:
          "Level 2 Tower - Average firing rate, Low Health, High Damage, Cost: 200",
      };
      break;
    case 3:
      defenderValues = {
        ...positioning,
        cost: 300,
        health: 500,
        fireRate: 90,
        hardness: 0,
        firingRange: 5,
        travelRange: 5,
        productionSpeed: 0,
        production: false,
        damage: 30,
        description:
          "Level 3 Tower - Average firing rate, High Health, average damage Cost: 300",
      };
      break;
    //add more cases for more defender types
    default:
      defenderValues = {
        ...positioning,
        cost: 100,
      };
  }
  defenderTypes.push(defenderValues);
}

class Defender {
  constructor(
    x,
    y,
    chosenDefender = 0,
    cost = 100,
    health = 100,
    fireRate = 50,
    hardness = 0,
    firingRange = 5,
    travelRange = 5,
    productionSpeed = 0,
    production = false,
    damage = 20,
    description = "N/A"
  ) {
    this.x = x;
    this.y = y;
    this.width = cellSize - cellGap * 2;
    this.height = cellSize - cellGap * 2;
    this.shooting = false;
    this.health = health;
    this.cost = cost;
    this.projectiles = [];
    this.timer = 0;
    this.fireRate = fireRate;
    this.defenderType = defenderSpriteTypes[chosenDefender];
    this.frameX = 0; // to cycle through frames for animation (Dont currently have any)
    this.frameY = 0; // same as above
    this.minFrame = 0; //also cycles
    this.maxFrame = 5; //^^
    this.spriteWidth = 164;
    this.spriteHeight = 195;
    this.firingRange = firingRange;
    this.travelRange = travelRange;
    this.production = production;
    this.productionSpeed = productionSpeed; // for adding resource producers
    this.hardness = hardness; // for adding wall types
    this.damage = damage;
    this.description = description;
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
        projectiles.push(
          new Projectiles(this.x + 50, this.y + 50, this.damage)
        );
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
        if (enemies[j].movement !== 0) {
          enemies[j].frameX = 0;
        }
        enemies[j].movement = 0;
        defenders[i].health -= enemies[j].damage;
      }
      if (defenders[i] && defenders[i].health <= 0) {
        defenders.splice(i, 1);
        i--;
        enemies[j].movement = enemies[j].speed;
      }
    }
  }
}
let buildDefender = false;
function chooseDefender() {
  for (let i = 0; i < defenderTypes.length; i++) {
    if (collision(mouse, defenderTypes[i]) && mouse.clicked) {
      for (let j = 0; j < defenderTypes.length; j++) {
        defenderTypes[j].isSelected = false;
      }
      defenderTypes[i].isSelected = true;
      globalChosenDefender = i;
      buildDefender = true;
      break;
    }
  }

  ctx.lineWidth = 2;
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  for (let i = 0; i < defenderTypes.length; i++) {
    ctx.fillRect(
      defenderTypes[i].x,
      defenderTypes[i].y,
      defenderTypes[i].width,
      defenderTypes[i].height
    );
    if (buildDefender) {
      ctx.strokeStyle = defenderTypes[i].isSelected ? "white" : "black";
      ctx.shadowBlur = defenderTypes[i].isSelected ? 10 : 0;
      ctx.shadowColor = "white";
    } else {
      ctx.strokeStyle = "black";
    }
    ctx.strokeRect(
      defenderTypes[i].x,
      defenderTypes[i].y,
      defenderTypes[i].width,
      defenderTypes[i].height
    );
    ctx.shadowBlur = 0;

    ctx.drawImage(
      defenderSpriteTypes[i],
      0,
      0,
      164,
      187,
      20 + 80 * i,
      15,
      defenderTypes[1].width * 0.8,
      defenderTypes[1].height * 0.8
    );
  }
}
function createDefender() {
  if (!buildDefender) {
    return;
  }
  const gridPositionX = mouse.x - (mouse.x % cellSize) + cellGap;
  const gridPositionY = mouse.y - (mouse.y % cellSize) + cellGap;
  if (gridPositionY < cellSize) {
    return;
  }
  for (let i = 0; i < defenders.length; i++) {
    if (defenders[i].x === gridPositionX && defenders[i].y === gridPositionY)
      return;
  }
  instantiateDefender(
    gridPositionX,
    gridPositionY,
    defenderTypes[globalChosenDefender]
  );
}
function instantiateDefender(
  gridPositionX,
  gridPositionY,
  {
    cost,
    chosenDefender,
    health,
    fireRate,
    hardness,
    firingRange,
    travelRange,
    productionSpeed,
    production,
    damage,
    description,
  }
) {
  if (numberOfResources >= cost) {
    defenders.push(
      new Defender(
        gridPositionX,
        gridPositionY,
        chosenDefender,
        cost,
        health,
        fireRate,
        hardness,
        firingRange,
        travelRange,
        productionSpeed,
        production,
        damage,
        description
      )
    );
    numberOfResources -= cost;
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
  buildDefender = false;
}
