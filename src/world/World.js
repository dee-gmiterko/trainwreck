import RailPiece from './RailPiece';
import Train from './Train';

export default class World extends PIXI.Container {

	constructor() {
		super();

		this.rails = [];

		this.initGenarator();

		//init
		this.rails.push({0: new RailPiece()});

		this.displayed = {
			from: 0,
			to: 0
		};

		this.generated = {
			from: 0,
			to: 0
		};

		this.clamp(0, 60);
	}

	connectRails(railA, indexA, railB, indexB) {
		railA.addTo(indexB);
		railB.addFrom(indexA);
	}
	
	generateNext(width) {
		var half = Math.floor(width / 2);
		
		var rails = {};
		for(var i=-half; i<=half; i++) {
			rails[i] = new RailPiece();
		}
		this.rails.push(rails);

		//rails
		var railsBefore = this.rails[this.rails.length-2];
		Object.keys(railsBefore).forEach(railIndex => {
			railIndex = parseInt(railIndex, 10);

			var usableGenerators = this.railGenerators.filter((railGenerator) => {
				return railGenerator.canUse(railsBefore, rails, railIndex);
			})

			if(usableGenerators.length > 0) {
				var railGenerator = usableGenerators[Math.floor(Math.random() * usableGenerators.length)];
				railGenerator.use(railsBefore, rails, railIndex);
			}
		});

		//carts
		Object.keys(rails).forEach(railIndex => {
			railIndex = parseInt(railIndex, 10);
			var railPiece = rails[railIndex];

			if(Math.random() < 0.05) {
				railPiece.isCart = true;
			}
		});
	}

	clamp(from, to) {
		
		for(var i=this.generated.to; i<to; i++) {
			this.generateNext(Math.min(7, (2 * Math.floor(Math.abs(Math.sin(i / 10)) * i / 7)) + 1));
		}
		this.generated.to = to;

		this.display(from, to);
	}

	initGenarator() {
		this.railGenerators = [];

		var addRailType = (callback, rarity) => {
			for(var i=0; i<rarity; i++) {
				this.railGenerators.push(callback);
			}
		}

		//straight
		addRailType({
			canUse: (railsBefore, rails, railIndex) => {
				return rails[railIndex] !== undefined;
			},
			use: (railsBefore, rails, railIndex) => {
				this.connectRails(railsBefore[railIndex], railIndex, rails[railIndex], railIndex);
			}
		}, 8);

		//up
		addRailType({
			canUse: (railsBefore, rails, railIndex) => {
				return rails[railIndex + 1] !== undefined;
			},
			use: (railsBefore, rails, railIndex) => {
				this.connectRails(railsBefore[railIndex], railIndex, rails[railIndex + 1], railIndex + 1);
			}
		}, 2);

		//down
		addRailType({
			canUse: (railsBefore, rails, railIndex) => {
				return rails[railIndex - 1] !== undefined;
			},
			use: (railsBefore, rails, railIndex) => {
				this.connectRails(railsBefore[railIndex], railIndex, rails[railIndex - 1], railIndex - 1);
			}
		}, 2);

		//split up
		addRailType({
			canUse: (railsBefore, rails, railIndex) => {
				return rails[railIndex] !== undefined
				&& rails[railIndex + 1] !== undefined
					//max one switch
					&& rails[railIndex + 1].railsCount() <= 2
					&& rails[railIndex].railsCount() <= 2
					&& railsBefore[railIndex].railsCount() <= 2;
				},
				use: (railsBefore, rails, railIndex) => {
					this.connectRails(railsBefore[railIndex], railIndex, rails[railIndex + 1], railIndex + 1);
					this.connectRails(railsBefore[railIndex], railIndex, rails[railIndex], railIndex);
				}
			}, 3);

		//split down
		addRailType({
			canUse: (railsBefore, rails, railIndex) => {
				return rails[railIndex] !== undefined
				&& rails[railIndex - 1] !== undefined
					//max one switch
					&& rails[railIndex - 1].railsCount() <= 2
					&& rails[railIndex].railsCount() <= 2
					&& railsBefore[railIndex].railsCount() <= 2;
				},
				use: (railsBefore, rails, railIndex) => {
					this.connectRails(railsBefore[railIndex], railIndex, rails[railIndex - 1], railIndex - 1);
					this.connectRails(railsBefore[railIndex], railIndex, rails[railIndex], railIndex);
				}
			}, 3);

	/*
		//backsplit up
		addRailType({
			canUse: (railsBefore, rails, railIndex) => {
				return rails[railIndex] !== undefined
					&& railsBefore[railIndex + 1] !== undefined
					//max one switch
					&& railsBefore[railIndex + 1].railsCount() <= 2
					&& railsBefore[railIndex].railsCount() <= 2
					&& rails[railIndex].railsCount() <= 2;
			},
			use: (railsBefore, rails, railIndex) => {
				this.connectRails(railsBefore[railIndex + 1], railIndex + 1, rails[railIndex], railIndex);
				this.connectRails(railsBefore[railIndex], railIndex, rails[railIndex], railIndex);
			}
		}, 2);

		//backsplit down
		addRailType({
			canUse: (railsBefore, rails, railIndex) => {
				return rails[railIndex] !== undefined
					&& railsBefore[railIndex - 1] !== undefined
					//max one switch
					&& railsBefore[railIndex - 1].railsCount() <= 2
					&& railsBefore[railIndex].railsCount() <= 2
					&& rails[railIndex].railsCount() <= 2;
			},
			use: (railsBefore, rails, railIndex) => {
				this.connectRails(railsBefore[railIndex - 1], railIndex - 1, rails[railIndex], railIndex);
				this.connectRails(railsBefore[railIndex], railIndex, rails[railIndex], railIndex);
			}
		}, 2);
	*/
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
		for (var i = this.children.length - 1; i >= 0; i--) {
			if(this.children[i].x < worldFrom || this.children[i].x > worldTo) {
				this.removeChild(this.children[i]);
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

						this.addChild(railSprite);
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
			railSprite.lineStyle(5, 0xffffff, 0.5);
			railSprite.moveTo(World.PIECE_WIDTH2, World.PIECE_HEIGHT2);
			railSprite.lineTo(World.PIECE_WIDTH, World.PIECE_HEIGHT2 + h * World.PIECE_HEIGHT2);
			railSprite.endFill();
		}

		for(var fromRailIndex of railPiece.from) {
			h = fromRailIndex - railIndex;
			railSprite.lineStyle(5, 0xffffff, 0.5);
			railSprite.moveTo(World.PIECE_WIDTH2, World.PIECE_HEIGHT2);
			railSprite.lineTo(0, World.PIECE_HEIGHT2 + h * World.PIECE_HEIGHT2);
			railSprite.endFill();
		}

		if(railPiece.isCart) {
			railSprite.beginFill(0xFFFF00);
			railSprite.lineStyle();
			railSprite.drawRect(World.PIECE_WIDTH2 - Train.CART_WIDTH2, World.PIECE_HEIGHT2 - Train.CART_HEIGHT2, Train.CART_WIDTH, Train.CART_HEIGHT);
		}
	}

	updateRailPiece(railsOffset, railIndex) {
		var x = railsOffset * World.PIECE_WIDTH;
		var y = railIndex * World.PIECE_HEIGHT;
		for(var i=0; i<this.children.length; i++) {
			if(this.children[i].x === x && this.children[i].y === y) {
				this.displayRailPiece(this.children[i], this.rails[railsOffset][railIndex], railIndex);
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
}

World.PIECE_WIDTH = 50;
World.PIECE_HEIGHT = 20;
World.PIECE_WIDTH2 = World.PIECE_WIDTH / 2;
World.PIECE_HEIGHT2 = World.PIECE_HEIGHT / 2;