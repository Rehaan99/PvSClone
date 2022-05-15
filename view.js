import { canvas, ctx } from './globalConstants.js';
let gameStarted = false,
	hordeMode = false;

$(document).ready(function () {
	$('.title').lettering();
	$('.button').lettering();
	animation();
	$('.button').click(function () {
		$('.container').hide();
		$('.button').hide();
		gameStarted = true;
	});
	$('.horde').click(function () {
		hordeMode = true;
	});
}, 1000);

function getGameStart() {
	return gameStarted;
}

function getHordeMode() {
	return hordeMode;
}

function levelOverScreen() {
	ctx.fillStyle = 'green';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function animation() {
	var title1 = new TimelineMax();
	title1.to('.button', 0, { visibility: 'hidden', opacity: 0 });
	title1.staggerFromTo(
		'.title span',
		0.5,
		{ ease: Back.easeOut.config(1.7), opacity: 0, bottom: -80 },
		{ ease: Back.easeOut.config(1.7), opacity: 1, bottom: 0 },
		0.05
	);
	title1.to('.button', 0.2, { visibility: 'visible', opacity: 1 });
}

export { getGameStart, getHordeMode, levelOverScreen };
