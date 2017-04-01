import World from './World';

export default class SwitchCursor extends PIXI.Container {

	constructor(train) {
		super();

		this.train = train;

		this.cursor = undefined;
		this.cursorX = 0;
		this.cursorY = 0;

		this.path = undefined;

		this.display();
		this.displayPath();

		this.recalculatePosition();
	}

	recalculatePosition() {
		var trainX = Math.floor(this.train.locomotive.x / World.PIECE_WIDTH);
		// var trainY = this.train.path[trainX];

		// if(this.cursorX === trainX && this.cursorY === trainY) {
			//find next switch
			var newCursorX = trainX + 1;
			while(newCursorX < this.train.world.rails.length
				&& newCursorX < this.train.path.length
				&& this.train.world.rails[newCursorX][this.train.path[newCursorX]]
				&& this.train.world.rails[newCursorX][this.train.path[newCursorX]].to.length < 2) {
				newCursorX++;
			}
			this.cursorX = newCursorX;
			this.cursorY = this.train.path[newCursorX];

			this.cursor.x = this.cursorX * World.PIECE_WIDTH + World.PIECE_WIDTH2;
			this.cursor.y = this.cursorY * World.PIECE_HEIGHT + World.PIECE_HEIGHT2;
		// }
	}

	display() {
		var cursor = new PIXI.Graphics();
		cursor.width = SwitchCursor.SIZE;
		cursor.height = SwitchCursor.SIZE;

		cursor.lineStyle(SwitchCursor.WIDTH, 0xff0000, 0.8);
		cursor.drawEllipse(0, 0, SwitchCursor.SIZE, SwitchCursor.SIZE);

		this.cursor = cursor;
		this.addChild(cursor);
	}

	displayPath() {
		if(this.path) {
			this.removeChild(this.path);
		}
		var path = new PIXI.Graphics();
		
		path.lineStyle(SwitchCursor.WIDTH, 0xffff00, 0.5);
		path.moveTo(World.PIECE_WIDTH, World.PIECE_HEIGHT2);
		for (var i=0; i < this.train.path.length; i++) {
			path.lineTo(World.PIECE_WIDTH * i + World.PIECE_WIDTH2, World.PIECE_HEIGHT * this.train.path[i] + World.PIECE_HEIGHT2);
		}
		path.endFill();

		this.path = path;
		this.addChild(path);
	}

	switchCursor(value) {
		if(this.cursorX !== undefined && this.cursorY !== undefined) {
			var railPiece = this.train.world.rails[this.cursorX][this.cursorY];

			var oldTo = railPiece.getTo();
			var oldFrom = railPiece.getFrom();
			
			railPiece.switchPrefered(this.train.direction, value);
			
			if(oldTo !== railPiece.getTo() || oldFrom !== railPiece.getFrom()) {
				this.train.recalculatePath(this.cursorX);
				this.displayPath();
			}
		}
	}
}

SwitchCursor.WIDTH = 4;
SwitchCursor.SIZE = 12;