import levelData from './levelData.JSON' assert { type: 'json' };
import { ctx } from './globalConstants.js';
let score = 0;
let currentLevel = 0;
let gameOver = false;
let { resources: numberOfResources } = levelData.level[currentLevel];
let enemiesToSpawn = levelData.level[currentLevel].enemies.spawnTypeOneAmount;
function collision(first, second) {
	if (
		first.x !== undefined &&
		first.y !== undefined &&
		second.x !== undefined &&
		second.y !== undefined &&
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
const calculateHealthBarColor = (health, maxHealth) => {
	const healthPercentage = health / maxHealth;

	if (healthPercentage > 0.8) {
		return 'green';
	} else if (healthPercentage > 0.6) {
		return 'yellow';
	} else if (healthPercentage > 0.4) {
		return 'orange';
	} else {
		return 'red';
	}
};

function drawHealthbar() {
	ctx.beginPath();
	ctx.rect(
		this.x + this.healthbarXOffset,
		this.y + this.healthbarYOffset,
		this.healthbarWidth * (this.health / this.maxHealth),
		this.healthbarHeight
	);
	ctx.fillStyle = calculateHealthBarColor(this.health, this.maxHealth);
	ctx.closePath();
	ctx.fill();
}

function getScore() {
	return score;
}
function setScore(value) {
	score += value;
}
function getResources() {
	return numberOfResources;
}
function setResources(value) {
	numberOfResources += value;
}
function getLevel() {
	const { levelNumber: gameLevel } = levelData.level[currentLevel];
	return gameLevel;
}
function setLevel(value) {
	currentLevel += value;
}
function getEnemiesToSpawn() {
	return enemiesToSpawn;
}
function setEnemiesToSpawn(value) {
	enemiesToSpawn -= value;
}
function getGameOver() {
	return gameOver;
}
function setGameOver(value) {
	gameOver = value;
}
export {
	collision,
	getScore,
	setScore,
	getResources,
	setResources,
	getLevel,
	setLevel,
	getEnemiesToSpawn,
	setEnemiesToSpawn,
	getGameOver,
	setGameOver,
	drawHealthbar
};
