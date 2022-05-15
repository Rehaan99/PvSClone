import { CANVAS, ctx } from './globalConstants.js';
import { collision } from './methodUtil.js';
const projectileTypes = [],
	projectiles = [],
	projectile1 = new Image();
projectile1.src = './images/towerProjectile.png';
projectileTypes.push(projectile1);
function getProjectiles() {
	return projectiles;
}
class Projectiles {
	constructor(x, y, damage) {
		this.x = x;
		this.y = y;
		this.width = 10;
		this.height = 10;
		this.power = damage;
		this.speed = 5;
		this.projectileType = projectileTypes[0];
		this.frameX = 0; // to cycle through frames for animation (Dont currently have any)
		this.frameY = 0; // same as above
		this.minFrame = 0; //also cycles
		this.maxFrame = 4; //^^
		this.spriteWidth = 62;
		this.spriteHeight = 57;
	}

	update() {
		this.x += this.speed;
	}

	draw() {
		ctx.drawImage(
			this.projectileType,
			this.frameX * this.spriteWidth,
			this.frameY * this.spriteHeight,
			this.spriteWidth,
			this.spriteHeight,
			this.x,
			this.y,
			this.width + 10,
			this.height + 10
		);
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.width, 0, Math.PI * 2);
	}
}

function handleProjectiles(enemies) {
	for (let i = 0; i < projectiles.length; i++) {
		projectiles[i].update();
		projectiles[i].draw();

		for (let j = 0; j < enemies.length; j++) {
			if (enemies[j] && projectiles[i] && collision(projectiles[i], enemies[j])) {
				enemies[j].health -= projectiles[i].power;
				projectiles.splice(i, 1);
				i--;
			}
		}

		if (projectiles[i] && projectiles[i].x > CANVAS.width) {
			projectiles.splice(i, 1);
			i--;
		}
	}
}
function createProjectiles(x, y, damage) {
	return new Projectiles(x, y, damage);
}

export { handleProjectiles, createProjectiles, getProjectiles };
