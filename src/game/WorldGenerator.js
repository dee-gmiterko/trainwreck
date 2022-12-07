import RailPiece from './RailPiece';
import * as config from "../config";

export default class WorldGenerator {

	constructor() {
		this.initGenarator();
	}

	generate(size, levelMaxWidth) {
		const rails = [];

		rails[0] = {0: new RailPiece()};
		rails[0][0].addFrom(0);
		for(let i=1; i<size-1; i++) {

			const psin = (x, f) => {
				if(f === undefined) {
					return Math.pow(Math.abs(Math.sin(x)), 2);
				} else {
					let r = Math.pow(Math.abs(Math.sin(x)), 2);
					return f + r * (1-f);
				}
			};

			const widthNoise = levelMaxWidth * psin(i / 321, 0.3) * Math.min(1, psin((i + 1) / 10) + psin((i - 64 ) / 41)) * psin(Math.sin(i/ 51) * 10, 0.5);
			const maxWidth = Math.max(1, Math.min(levelMaxWidth, Math.min(i, size-i)));
			const width = Math.min(maxWidth, (2 * Math.floor(widthNoise)) + 1);

			this.generateColumn(rails, width, false);
		}
		//empty space after level
		for(let i=0; i<40; i++) {
			this.generateColumn(rails, 1, true);
		}
		rails[rails.length-1][0].addTo(0);

		return rails.map(column => (
			Object.fromEntries(Object.entries(column).map(([index, railPiece]) => (
				[index, railPiece.getData()]
			)))
		));
	}

	generateColumn(rails, width, emptySpace) {
		const half = Math.floor(width / 2);

		const column = {};
		for(let i=-half; i<=half; i++) {
			column[i] = new RailPiece();
		}
		rails.push(column);

		//rails
		const columnBefore = rails[rails.length-2];
		Object.keys(columnBefore).forEach(railIndex => {
			railIndex = parseInt(railIndex, 10);

			const usableGenerators = this.railGenerators.filter((railGenerator) => {
				return railGenerator.canUse(columnBefore, column, railIndex);
			})

			if(usableGenerators.length > 0) {
				const railGenerator = usableGenerators[Math.floor(Math.random() * usableGenerators.length)];
				railGenerator.use(columnBefore, column, railIndex);
			}
		});

		// empty carts
		if(!emptySpace) {
			for(let index in column) {
				const railPiece = column[index];

				if(Math.random() < config.EMPTY_CART_PROBABILITY) {
					railPiece.isCart = true;
				}
			}
		}
	}

	initGenarator() {
		this.railGenerators = [];

		const addRailType = (callback, rarity) => {
			for(let i=0; i<rarity; i++) {
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
