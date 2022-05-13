const levelData = [],
	canvas = document.getElementById('canvas1'),
	ctx = canvas.getContext('2d');
canvas.width = 1000;
canvas.height = 700;

class LevelInfo {
	constructor(resources, enemies, spawn) {
		this.numberOfResources = resources;
		this.enemiesToSpawn = enemies;
		this.enemiesInterval = spawn;
	}
}
//level 1
levelData.push(new LevelInfo(300, 30, 600));
//level 2
levelData.push(new LevelInfo(300, 50, 600));
//level 3
levelData.push(new LevelInfo(300, 50, 500));
//level 4
levelData.push(new LevelInfo(200, 50, 500));
//level 5
levelData.push(new LevelInfo(200, 30, 600));
//level 6
levelData.push(new LevelInfo(200, 30, 600));
//level 7
levelData.push(new LevelInfo(300, 30, 600));
//level 8
levelData.push(new LevelInfo(300, 30, 600));
//level 9
levelData.push(new LevelInfo(300, 30, 600));
//level 10
levelData.push(new LevelInfo(500, 150, 200));
//level 11
levelData.push(new LevelInfo(300, 30, 600));
