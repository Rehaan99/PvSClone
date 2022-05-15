import { cellSize, cellGap, canvas, ctx } from './globalConstants.js';
import { FloatingMessage, floatingMessages } from './floatingMessages.js';
import { setScore, setResources, setGameOver, drawHealthbar } from './methodUtil.js';
export const enemySprites = [],
	enemyPosition = [],
	enemies = [],
	deadEnemies = [];
let spawnedEnemies = 0;

for (let i = 0; i < 12; i++) {
	let enemySprite = new Image();
	enemySprite.src = './images/Goblin/Running/0_Goblin_Running_' + i + '.png';
	enemySprites.push(enemySprite);
}
for (let i = 0; i < 12; i++) {
	let enemySprite = new Image();
	enemySprite.src = './images/Goblin/Dying/0_Goblin_Dying_' + i + '.png';
	enemySprites.push(enemySprite);
}
for (let i = 0; i < 12; i++) {
	let enemySprite = new Image();
	enemySprite.src = './images/Goblin/Slashing/0_Goblin_Slashing_' + i + '.png';
	enemySprites.push(enemySprite);
}

class Enemy {
	healthbarWidth = 60;
	healthbarHeight = 6;
	drawHealthbar = drawHealthbar.bind(this);
	healthbarXOffset = -10;
	healthbarYOffset = 0;

	constructor(verticalPosition, x = canvas.width, speed = 1.2, health = 100, dead = false, damage = 0.2) {
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

	update(frame) {
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

		if (!this.dead && this.health >= 0) {
			this.drawHealthbar();
		}
	}
}
function handleEnemies(frame, enemiesInterval, gameStarted, hordeMode, enemiesToSpawn) {
	for (let i = 0; i < enemies.length; i++) {
		enemies[i].update(frame);
		enemies[i].draw();
		if (enemies[i].x < 0 && gameStarted) {
			setGameOver(true);
			return;
		}
		if (enemies[i].health <= 0) {
			const gainedResources = enemies[i].maxHealth / 10;
			setResources(gainedResources);
			floatingMessages.push(new FloatingMessage('+' + gainedResources, 250, 50, 30, 'gold'));
			setScore(gainedResources);
			enemyPosition.splice(enemyPosition.indexOf(enemies[i].y), 1);
			deadEnemies.push(new Enemy(enemies[i].y, enemies[i].x, 0, enemies[i].health, true, 0));
			enemies.splice(i, 1);
			i--;
		}
	}
	for (let i = 0; i < deadEnemies.length; i++) {
		deadEnemies[i].update(frame);
		deadEnemies[i].draw();
		if (deadEnemies[i].frameX === deadEnemies[i].maxFrame) {
			deadEnemies.splice(i, 1);
			i--;
		}
	}
	if (frame % enemiesInterval === 0 && spawnedEnemies < enemiesToSpawn && (frame > 0 || !gameStarted)) {
		const verticalPosition = Math.floor(Math.random() * 5 + 1) * cellSize + cellGap;
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
function getSpawnedEnemies() {
	return spawnedEnemies;
}
export { handleEnemies, getSpawnedEnemies };
