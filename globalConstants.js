export const canvas = document.getElementById('canvas1'),
	ctx = canvas.getContext('2d');
canvas.width = 1000;
canvas.height = 700;
export const cellSize = 100,
	cellGap = 3,
	gameGrid = [],
	mouse = {
		x: undefined,
		y: undefined,
		width: 0.1,
		height: 0.1,
		clicked: false
	},
	controlsBar = {
		width: canvas.width,
		height: cellSize
	};
