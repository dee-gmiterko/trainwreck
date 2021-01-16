import RailPiece from './RailPiece';

export default class WorldGenerator {

	constructor() {

		this.rails = []
		this.rails.push({0: new RailPiece()});

		this.generated = {
			from: 0,
			to: 0
		};

		this.initGenarator();
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

			if(Math.random() < WorldGenerator.EMPTY_CART_PROBABILITY) {
				railPiece.isCart = true;
			}
		});
	}

	clamp(from, to) {
		for(var i=this.generated.to; i<to; i++) {

			var psin = (x, f) => {
				if(f === undefined) {
					return Math.pow(Math.abs(Math.sin(x)), 2);
				} else {
					let r = Math.pow(Math.abs(Math.sin(x)), 2);
					return f + r * (1-f);
				}
			};

			var width = 5 * psin(i / 321, 0.3) * Math.min(1, psin((i + 1) / 10) + psin((i - 64 ) / 41)) * psin(Math.sin(i/ 51) * 10, 0.5);
			width = Math.min(9, (2 * Math.floor(width)) + 1);

			this.generateNext(width);
		}
		this.generated.to = to;
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

	}

	connectRails(railA, indexA, railB, indexB) {
		railA.addTo(indexB);
		railB.addFrom(indexA);
	}
}

WorldGenerator.EMPTY_CART_PROBABILITY = 0.1;
