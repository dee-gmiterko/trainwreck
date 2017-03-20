import World from './World';

export default class SwitchCursor extends PIXI.Container {

	constructor(train) {
		super();

		this.train = train;
		this.cursorX = 0;
		this.cursorY = 0;

		this.display();

		this.recalculatePosition();
	}

	recalculatePosition() {
		var trainX = Math.floor(this.train.locomotive.x / World.PIECE_WIDTH);
		var trainY = this.train.path[trainX];

		if(this.cursorX === trainX && this.cursorY === trainY) {
			//find next switch
			var newCursorX = trainX + 1;
			console.log(this.train.world.rails[newCursorX][this.train.path[newCursorX]].isSwitch);
			while(!this.train.world.rails[newCursorX][this.train.path[newCursorX]].isSwitch) {
				newCursorX++;
				if(newCursorX > this.train.world.rails.length) {
					break;
				}
			}
			this.cursorX = newCursorX;
			this.cursorY = this.train.path[newCursorX];

			this.children[0].x = this.cursorX * World.PIECE_WIDTH + World.PIECE_WIDTH2;
			this.children[0].y = this.cursorY * World.PIECE_HEIGHT + World.PIECE_HEIGHT2;
		}
	}

	display() {
		var cursor = new PIXI.Graphics();
		cursor.width = SwitchCursor.SIZE;
		cursor.height = SwitchCursor.SIZE;

		cursor.lineStyle(SwitchCursor.WIDTH, 0xff0000, 0.8);
		cursor.drawEllipse(0, 0, SwitchCursor.SIZE, SwitchCursor.SIZE);

		this.addChild(cursor);
	}
}

SwitchCursor.WIDTH = 4;
SwitchCursor.SIZE = 12;