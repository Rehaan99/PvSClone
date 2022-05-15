import { FloatingMessage, floatingMessages } from './floatingMessages.js';
import { CANVAS, CELL_SIZE, ctx, MOUSE } from './globalConstants.js';
import { collision, setResources } from './methodUtil.js';
const coinSprites = [],
	resources = [],
	amounts = [20, 30, 40];
for (let i = 1; i < 11; i++) {
	let coinSprite = new Image();
	coinSprite.src = './images/Gold_' + i + '.png';
	coinSprites.push(coinSprite);
}

class Resource {
	constructor() {
		this.x = Math.random() * (CANVAS.width - 60) + 30;
		this.y = Math.random() * 0.8 * (CANVAS.height - 200) + 1 * CELL_SIZE + 25;
		this.width = CELL_SIZE * 0.4;
		this.height = CELL_SIZE * 0.4;
		this.amount = amounts[Math.floor(Math.random() * amounts.length)];
		this.frameX = 0;
		this.frameY = 0;
		this.minFrame = 0;
		this.maxFrame = 9;
	}

	draw() {
		ctx.drawImage(coinSprites[this.frameX], this.x, this.y, coinSprites[this.frameX].width / 15, this.height);
		ctx.fillStyle = 'yellow';
		ctx.font = '20px Arial';
		ctx.fillText(this.amount, this.x - 5, this.y);
	}

	update(frame) {
		if (frame % 5 === 0) {
			if (this.frameX < this.maxFrame) {
				this.frameX++;
			} else {
				this.frameX = this.minFrame;
			}
		}
	}
}

function handleResources(frame, gameOver) {
	if (frame % 500 === 0 && !gameOver && frame > 0) {
		resources.push(new Resource());
	}
	for (let i = 0; i < resources.length; i++) {
		resources[i].draw();
		resources[i].update(frame);
		if (resources[i] && MOUSE.x && MOUSE.y && collision(resources[i], MOUSE)) {
			setResources(resources[i].amount);
			floatingMessages.push(
				new FloatingMessage('+' + resources[i].amount, resources[i].x, resources[i].y, 30, 'gold')
			);
			floatingMessages.push(new FloatingMessage('+' + resources[i].amount, 250, 50, 30, 'gold'));
			resources.splice(i, 1);
			i--;
		}
	}
}

export { handleResources };
