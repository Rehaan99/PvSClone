const defenderSpriteTypes = [],
  defenders = [],
  defenderTypes = [];
let globalChosenDefender = 0,
  buildDefender = false,
  tooltipTimer = 0,
  displayTooltip = false,
  currentHover;

for (let i = 1; i < 4; i++) {
  const defenderSprite = new Image(),
    positioning = {
      x: 10 + 80 * (i - 1),
      y: 10,
      width: 70,
      height: 85,
      chosenDefender: i - 1,
      isSelected: false,
    };
  let defenderValues;

  defenderSprite.src = "./images/tower" + i + ".png";
  defenderSpriteTypes.push(defenderSprite);

  switch (i) {
    case 2:
      defenderValues = {
        ...positioning,
        cost: 200,
        compensation: 175,
        health: 40,
        fireRate: 50,
        hardness: 0,
        firingRange: 5,
        travelRange: 5,
        productionSpeed: 0,
        production: false,
        damage: 50,
        description:
          "Level 2 Tower /n Average firing rate, Low Health, High Damage. /n Cost: 200",
      };
      break;
    case 3:
      defenderValues = {
        ...positioning,
        cost: 300,
        compensation: 275,
        health: 200,
        fireRate: 90,
        hardness: 0,
        firingRange: 5,
        travelRange: 5,
        productionSpeed: 0,
        production: false,
        damage: 30,
        description:
          "Level 3 Tower /n Average firing rate, High Health, average damage. /n Cost: 300",
      };
      break;
    //add more cases for more defender types
    default:
      defenderValues = {
        ...positioning,
        cost: 100,
        compensation: 75,
        description:
          "Level 1 Tower /n Basic Tower average Firing rate, average health, low damage. /n Cost : 100",
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
    compensation = 75,
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
    this.compensation = compensation;
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
      return;
    }
    if (this.timer === this.fireRate) {
      this.timer = 0;
    } else if (this.timer !== 0) {
      this.timer++;
    }
  }

  //Function to destroy the defender
  sell(){
    defenders.splice(defenders.findIndex((item)=>item==this)); // Removes this defender from the defenders array
    numberOfResources += this.compensation; // Add the compensation back to Resources
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

    // if the user right clicked on a defender
    if(collision(defenders[i],mouse) && mouse.rightClicked){
      defenders[i].sell();
    }
  }
}

function drawGhost(gridCell) {
  const gridPositionX = gridCell.x + cellGap,
    gridPositionY = gridCell.y + cellGap;
  if (
    buildDefender &&
    collision(gridCell, mouse) &&
    !doesDefenderOccupySpace(gridPositionX, gridPositionY)
  ) {
    ctx.globalAlpha = 0.4;
    ctx.drawImage(
      defenderSpriteTypes[globalChosenDefender],
      0,
      0,
      164,
      195,
      gridPositionX + 10,
      gridPositionY,
      cellSize - cellGap * 2 - 20,
      cellSize - cellGap * 2
    );
    ctx.globalAlpha = 1;
    return true;
  }

  return false;
}

function chooseDefender() {
  for (let i = 0; i < defenderTypes.length; i++) {
    if (collision(mouse, defenderTypes[i])) {
      currentHover = i;
      if (mouse.clicked) {
        if (defenderTypes[i].isSelected) {
          for (let j = 0; j < defenderTypes.length; j++) {
            defenderTypes[j].isSelected = false;
          }
          buildDefender = false;
        } else {
          for (let j = 0; j < defenderTypes.length; j++) {
            defenderTypes[j].isSelected = false;
          }
          defenderTypes[i].isSelected = true;
          globalChosenDefender = i;
          buildDefender = true;
        }
        break;
      } else {
        if (!displayTooltip && tooltipTimer >= 80) {
          tooltipTimer = 0;
          displayTooltip = true;
        } else {
          tooltipTimer++;
        }
      }
    }
    if (
      currentHover != undefined &&
      !collision(mouse, defenderTypes[currentHover])
    ) {
      displayTooltip = false;
      tooltipTimer = 0;
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

function wrapText(textYPos, tooltipWidth, text, fontSize) {
  const words = text.split(" ");
  let parameters = { line: [], yPos: [] },
    line = "",
    newLine,
    index = 0;

  for (let i = 0; i < words.length; i++) {
    if (words[i] === "/n") {
      words[i] = "";
      newLine = true;
    }
    let testLine = line + words[i] + " ",
      testWidth = ctx.measureText(testLine).width;
    if ((testWidth > tooltipWidth - 5 && i > 0) || newLine) {
      parameters.line[index] = line;
      parameters.yPos[index] = textYPos + fontSize;
      index++;
      line = newLine ? words[i] : words[i] + " ";
      newLine = false;
      textYPos += fontSize;
    } else {
      line = testLine;
    }
  }
  if (line != words[words.length]) {
    parameters.line[index] = line;
    parameters.yPos[index] = textYPos + fontSize;
  }
  return parameters;
}

function doesDefenderOccupySpace(gridPositionX, gridPositionY) {
  for (let i = 0; i < defenders.length; i++) {
    if (defenders[i].x === gridPositionX && defenders[i].y === gridPositionY) {
      return true;
    }
  }
  return false;
}

function createDefender() {
  if (!buildDefender) {
    return;
  }
  const gridPositionX = mouse.x - (mouse.x % cellSize) + cellGap,
    gridPositionY = mouse.y - (mouse.y % cellSize) + cellGap;
  if (
    gridPositionY < cellSize ||
    gridPositionY > cellSize * 6 ||
    gridPositionX > cellSize * 9
  ) {
    return;
  }
  if (doesDefenderOccupySpace(gridPositionX, gridPositionY)) {
    return;
  }
  defenderTypes[globalChosenDefender].isSelected = false;
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
    compensation,
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
        compensation,
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
