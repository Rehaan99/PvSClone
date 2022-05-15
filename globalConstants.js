export const CANVAS = document.getElementById('canvas1'),
	ctx = CANVAS.getContext('2d');
CANVAS.width = 1000;
CANVAS.height = 700;
export const CELL_SIZE = 100,
	CELL_GAP = 3,
	gameGrid = [],
	MOUSE = {
		x: undefined,
		y: undefined,
		width: 0.1,
		height: 0.1,
		clicked: false,
		rightClicked: false
	},
	CONTROL_BAR = {
		width: CANVAS.width,
		height: CELL_SIZE
	};
