import RailPiece from './RailPiece';
import * as config from "../config";

export default class WorldGenerator {

	constructor() {
		this.initGenarator();
	}

	generate(size) {
		const rails = [];

		rails[0] = {0: new RailPiece()};
		for(var i=1; i<size-1; i++) {

			var psin = (x, f) => {
				if(f === undefined) {
					return Math.pow(Math.abs(Math.sin(x)), 2);
				} else {
					let r = Math.pow(Math.abs(Math.sin(x)), 2);
					return f + r * (1-f);
				}
			};

			var width = 10 * psin(i / 321, 0.3) * Math.min(1, psin((i + 1) / 10) + psin((i - 64 ) / 41)) * psin(Math.sin(i/ 51) * 10, 0.5);
			width = Math.min(9, (2 * Math.floor(width)) + 1);

			this.generateColumn(rails, width);
		}
		rails[size-1] = {0: new RailPiece()};

		return rails.map(column => (
			Object.fromEntries(Object.entries(column).map(([index, railPiece]) => (
				[index, railPiece.getData()]
			)))
		));
	}

	generateColumn(rails, width) {
		var half = Math.floor(width / 2);

		var column = {};
		for(var i=-half; i<=half; i++) {
			column[i] = new RailPiece();
		}
		rails.push(column);

		//rails
		var columnBefore = rails[rails.length-2];
		Object.keys(columnBefore).forEach(railIndex => {
			railIndex = parseInt(railIndex, 10);

			var usableGenerators = this.railGenerators.filter((railGenerator) => {
				return railGenerator.canUse(columnBefore, column, railIndex);
			})

			if(usableGenerators.length > 0) {
				var railGenerator = usableGenerators[Math.floor(Math.random() * usableGenerators.length)];
				railGenerator.use(columnBefore, column, railIndex);
			}
		});

		// empty carts
		for(let index in column) {
			var railPiece = column[index];

			if(Math.random() < config.EMPTY_CART_PROBABILITY) {
				railPiece.isCart = true;
			}
		}
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
