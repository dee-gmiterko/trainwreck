import railEasingIn from 'eases/sine-in';
import railEasingOut from 'eases/sine-out';
import Train from './Train';
import WorldGenerator from './WorldGenerator';

export default class World extends PIXI.Container {

	constructor() {
		super();

		this.generator = new WorldGenerator();
		this.rails = this.generator.rails;

		this.displayed = {
			from: 0,
			to: 0
		};
		
		this.map = new PIXI.Container();
		this.addChild(this.map);
		
		this.trains = new PIXI.Container();
		this.trains.x = World.PIECE_WIDTH2;
		this.trains.y = World.PIECE_HEIGHT2;
		this.addChild(this.trains);

		this.clamp(0, 60);

		this.trains.addChild(new Train(this, 0, 0, Train.RIGHT, false));

	}

	clamp(from, to) {
		this.generator.clamp(from, to);
		this.display(from, to);
	}

	display(from, to) {
		if(from === undefined) {
			from = 0;
		}
		if(to === undefined) {
			to = this.rails.length;
		}

		//remove before from
		var worldFrom = World.PIECE_WIDTH * from;
		var worldTo = World.PIECE_WIDTH * to;
		for (var i = this.map.children.length - 1; i >= 0; i--) {
			if(this.map.children[i].x < worldFrom || this.map.children[i].x > worldTo) {
				this.map.removeChild(this.map.children[i]);
			}
		}

		var displayRailsColumn = (rails) => {
			for(var railIndex in rails) {
				if(!isNaN(parseInt(railIndex, 10))) {
					var railPiece = rails[railIndex];

					if(!railPiece.isEmpty) {
						var railSprite = new PIXI.Graphics();

						railSprite.x = i * World.PIECE_WIDTH;
						railSprite.y = railIndex * World.PIECE_HEIGHT;
						railSprite.width = World.PIECE_WIDTH;
						railSprite.height = World.PIECE_HEIGHT;

						this.displayRailPiece(railSprite, railPiece, railIndex);

						this.map.addChild(railSprite);
					}
				}
			}
		}

		//add rails
		for(i=this.displayed.to; i<to; i++) {
			displayRailsColumn(this.rails[i]);
		}
		for(i=from; i<this.displayed.from; i++) {
			displayRailsColumn(this.rails[i]);
		}

		this.displayed.from = from
		this.displayed.to = to;
	}

	displayRailPiece(railSprite, railPiece, railIndex) {
		railSprite.clear();
		
		var h;

		for(var toRailIndex of railPiece.to) {
			h = toRailIndex - railIndex;
			this.displayRailPieceSegment(railSprite, World.PIECE_WIDTH2, World.PIECE_HEIGHT2, World.PIECE_WIDTH, World.PIECE_HEIGHT2 + h * World.PIECE_HEIGHT2, railEasingIn)
		}

		for(var fromRailIndex of railPiece.from) {
			h = fromRailIndex - railIndex;
			this.displayRailPieceSegment(railSprite, 0, World.PIECE_HEIGHT2 + h * World.PIECE_HEIGHT2, World.PIECE_WIDTH2, World.PIECE_HEIGHT2, railEasingOut)
		}


		if(railPiece.isCart) {
			railSprite.beginFill(0xFFFF00);
			railSprite.lineStyle();
			railSprite.drawRect(World.PIECE_WIDTH2 - Train.CART_WIDTH2, World.PIECE_HEIGHT2 - Train.CART_HEIGHT2, Train.CART_WIDTH, Train.CART_HEIGHT);
		}
	}

	displayRailPieceSegment(railSprite, fromX, fromY, toX, toY, railEasing) {
		var dX = toX-fromX;
		
		//top rail
		railSprite.lineStyle(1, 0xffffff);
		for(let i=0; i<World.SUBPIECES; i++) {
			railSprite.moveTo(fromX + ((i-1)/World.SUBPIECES)*dX,
				fromY + railEasing((i-1)/World.SUBPIECES) * (toY - fromY) - World.TRACK_WIDTH2);
			railSprite.lineTo(fromX + ((i)/World.SUBPIECES)*dX,
				fromY + railEasing((i)/World.SUBPIECES) * (toY - fromY) - World.TRACK_WIDTH2);
		}
		railSprite.endFill();

		//bottom rail
		railSprite.lineStyle(1, 0xffffff);
		for(let i=0; i<World.SUBPIECES; i++) {
			railSprite.moveTo(fromX + ((i-1)/World.SUBPIECES)*dX,
				fromY + railEasing((i-1)/World.SUBPIECES) * (toY - fromY) + World.TRACK_WIDTH2);
			railSprite.lineTo(fromX + ((i)/World.SUBPIECES)*dX,
				fromY + railEasing((i)/World.SUBPIECES) * (toY - fromY) + World.TRACK_WIDTH2);
		}
		railSprite.endFill();

		//railroad tie
		railSprite.lineStyle(1, 0xaaaaaa);
		for(let i=0; i<World.SUBPIECES; i++) {
			railSprite.moveTo(fromX + ((i)/World.SUBPIECES)*dX,
				fromY + railEasing((i)/World.SUBPIECES) * (toY - fromY) - World.TRACK_TIE_WIDTH2);
			railSprite.lineTo(fromX + ((i)/World.SUBPIECES)*dX,
				fromY + railEasing((i)/World.SUBPIECES) * (toY - fromY) + World.TRACK_TIE_WIDTH2);
		}
		railSprite.endFill();
	}

	updateRailPiece(railsOffset, railIndex) {
		var x = railsOffset * World.PIECE_WIDTH;
		var y = railIndex * World.PIECE_HEIGHT;
		for(var i=0; i<this.map.children.length; i++) {
			if(this.map.children[i].x === x && this.map.children[i].y === y) {
				this.displayRailPiece(this.map.children[i], this.rails[railsOffset][railIndex], railIndex);
			}
		}
	}

	getPath(railsOffset, railIndex, direction, path) {
		if(!path) {
			path = [];
		}
		path[railsOffset] = railIndex;
		while(railsOffset < this.rails.length) {
			var railPiece = this.rails[railsOffset][railIndex];
			if(!railPiece) {
				console.log("Wrong path!", railsOffset, railIndex);
				break;
			}
			var next = (direction === 1) ? railPiece.getTo() : railPiece.getFrom();

			if(next === undefined) {
				break; //EOW
			}
			
			railsOffset += direction;
			
			if(path[railsOffset] === next) {
				break; //already same path
			}
			
			path[railsOffset] = next;
			railIndex = next;
		}
		return path;
	}

	getTrain() {
		return this.trains.children[0];
	}

	getEnemyTrains() {
		return this.trains.children.slice(1, this.trains.children.length);
	}
}

World.PIECE_WIDTH = 88;
World.PIECE_HEIGHT = 16;
World.PIECE_WIDTH2 = World.PIECE_WIDTH / 2;
World.PIECE_HEIGHT2 = World.PIECE_HEIGHT / 2;

World.SUBPIECES = 16;
World.TRACK_WIDTH2 = 2;
World.TRACK_TIE_WIDTH2 = 3;