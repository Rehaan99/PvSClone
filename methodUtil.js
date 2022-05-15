import levelData from './levelData.json' assert { type: 'json' };
let score = 0;
let currentLevel = 0;
let gameOver = false;
let { resources: numberOfResources } = levelData.level[currentLevel];
let enemiesToSpawn = levelData.level[currentLevel].enemies.spawnTypeOneAmount;
export default function collision(first, second) {
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
	setGameOver
};
