import RailPiece from './RailPiece';

export default class World extends PIXI.Container {

	constructor() {
		super();

		this.rails = [];

		this.initGenarator();

		//init
		var r0 = new RailPiece();
		var r1 = new RailPiece();
		var r2 = new RailPiece();
		this.connectRails(r0, 0, r1, 0);
		this.connectRails(r1, 0, r2, 0);
		this.rails.push({0: r0});
		this.rails.push({0: r1});
		this.rails.push({0: r2});

		for(var i=0; i<100; i++) {
			this.generateNext((2 * Math.floor(Math.abs(Math.sin(i / 10)) * i / 7)) + 1);
		}

		this.display();
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

		var railsBefore = this.rails[this.rails.length-2];
		Object.keys(railsBefore).forEach(railIndex => {
			railIndex = parseInt(railIndex);

			var usableGenerators = this.railGenerators.filter((railGenerator) => {
				return railGenerator.canUse(railsBefore, rails, railIndex);
			})

			if(usableGenerators.length > 0) {
				var railGenerator = usableGenerators[Math.floor(Math.random() * usableGenerators.length)];
				railGenerator.use(railsBefore, rails, railIndex);
			}
		});
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
		}, 1);

		//down
		addRailType({
			canUse: (railsBefore, rails, railIndex) => {
				return rails[railIndex - 1] !== undefined;
			},
			use: (railsBefore, rails, railIndex) => {
				this.connectRails(railsBefore[railIndex], railIndex, rails[railIndex - 1], railIndex - 1);
			}
		}, 1);

		//split up
		addRailType({
			canUse: (railsBefore, rails, railIndex) => {
				return rails[railIndex] !== undefined && rails[railIndex + 1] !== undefined;
			},
			use: (railsBefore, rails, railIndex) => {
				this.connectRails(railsBefore[railIndex], railIndex, rails[railIndex + 1], railIndex + 1);
				this.connectRails(railsBefore[railIndex], railIndex, rails[railIndex], railIndex);
			}
		}, 1);

		//split down
		addRailType({
			canUse: (railsBefore, rails, railIndex) => {
				return rails[railIndex] !== undefined && rails[railIndex - 1] !== undefined;
			},
			use: (railsBefore, rails, railIndex) => {
				this.connectRails(railsBefore[railIndex], railIndex, rails[railIndex - 1], railIndex - 1);
				this.connectRails(railsBefore[railIndex], railIndex, rails[railIndex], railIndex);
			}
		}, 1);

		//backsplit up
		addRailType({
			canUse: (railsBefore, rails, railIndex) => {
				return rails[railIndex] !== undefined && railsBefore[railIndex + 1] !== undefined;
			},
			use: (railsBefore, rails, railIndex) => {
				this.connectRails(railsBefore[railIndex + 1], railIndex + 1, rails[railIndex], railIndex);
				this.connectRails(railsBefore[railIndex], railIndex, rails[railIndex], railIndex);
			}
		}, 1);

		//backsplit down
		addRailType({
			canUse: (railsBefore, rails, railIndex) => {
				return rails[railIndex] !== undefined && railsBefore[railIndex - 1] !== undefined;
			},
			use: (railsBefore, rails, railIndex) => {
				this.connectRails(railsBefore[railIndex - 1], railIndex - 1, rails[railIndex], railIndex);
				this.connectRails(railsBefore[railIndex], railIndex, rails[railIndex], railIndex);
			}
		}, 1);
	}

	display() {
		//clear
		for (var i = this.children.length - 1; i >= 0; i--) {
			this.removeChild(this.children[i]);
		}

		//add rails
		for(i=0; i<this.rails.length; i++) {
			var rails = this.rails[i];
			for(var railIndex in rails) {
				var railPiece = rails[railIndex];

				// if(!railPiece.isEmpty) {
					var railSprite = new PIXI.Graphics();

					this.displayRailPiece(railSprite, railPiece, railIndex);

					railSprite.x = i * this.PIECE_WIDTH;
					railSprite.y = railIndex * this.PIECE_HEIGHT;
					// railSprite.anchor.x = 0.5;
					// railSprite.anchor.y = 0.5;

					this.addChild(railSprite);
				// }
			}
		}
	}

	displayRailPiece(railSprite, railPiece, railIndex) {
		railSprite.width = this.PIECE_WIDTH;
		railSprite.height = this.PIECE_HEIGHT;

		railSprite.lineStyle(1, 0xFF0000);
		railSprite.drawRect(1, 1, this.PIECE_WIDTH - 2, this.PIECE_HEIGHT - 2);

		for(var toRailIndex of railPiece.to) {
			let h = toRailIndex - railIndex;
			console.log(h);
			railSprite.lineStyle(5, 0xffffff);
			railSprite.moveTo(this.PIECE_WIDTH2, this.PIECE_HEIGHT2);
			railSprite.lineTo(this.PIECE_WIDTH, this.PIECE_HEIGHT2 + h * this.PIECE_HEIGHT2);
			railSprite.endFill();
		}

		for(var fromRailIndex of railPiece.from) {
			let h = fromRailIndex - railIndex;

			railSprite.lineStyle(5, 0xffffff);
			railSprite.moveTo(this.PIECE_WIDTH2, this.PIECE_HEIGHT2);
			railSprite.lineTo(0, this.PIECE_HEIGHT2 + h * this.PIECE_HEIGHT2);
			railSprite.endFill();
		}
	}
}

World.PIECE_WIDTH = 50;
World.PIECE_HEIGHT = 20;
World.PIECE_WIDTH2 = this.PIECE_WIDTH / 2;
World.PIECE_HEIGHT2 = this.PIECE_HEIGHT / 2;