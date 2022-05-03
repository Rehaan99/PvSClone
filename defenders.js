const defenderTypes = [];
const defenders = [];
let chosenDefender = 0;
let defenderCost = 100;
const defender1 = new Image();
defender1.src = "./images/tower1.png";
defenderTypes.push(defender1);
const defender2 = new Image();
defender2.src = "./images/tower2.png";
defenderTypes.push(defender2);
const defender3 = new Image();
defender3.src = "./images/tower3.png";
defenderTypes.push(defender3);
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
    this.fireRate = 50;
    this.defenderType = defenderTypes[chosenDefender];
    this.frameX = 0; // to cycle through frames for animation (Dont currently have any)
    this.frameY = 0; // same as above
    this.minFrame = 0; //also cycles
    this.maxFrame = 5; //^^
    this.spriteWidth = 164;
    this.spriteHeight = 195;
    this.firingRange;
    this.travelRange;
    this.production = false;
    this.productionSpeed; // for adding resource producers
    this.hardness = 0; // for adding wall types
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
function chooseDefender() {
  if (collision(mouse, card1) && mouse.clicked) {
    chosenDefender = 0;
    card1.color = "gold";
    card2.color = "black";
  } else if (collision(mouse, card2) && mouse.clicked) {
    chosenDefender = 1;
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
