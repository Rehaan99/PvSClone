const levelData = [];
class LevelInfo {
  constructor(resources, enemies, spawn) {
    this.numberOfResources = resources;
    this.enemiesToSpawn = enemies;
    this.enemiesInterval = spawn;
  }
}
//level 1
levelData.push(new LevelInfo(300, 30, 600));
