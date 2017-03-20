import RailPiece from './RailPiece';

export default class World extends PIXI.Container {

	constructor() {
		this.rails = [];

		//init
		var r0 = new RailPiece();
		var r1 = new RailPiece();
		var r2 = new RailPiece();
		this.connectRails(r0, 0, r1, 0);
		this.connectRails(r1, 0, r2, 0);
		this.rails.push({0: r0});
		this.rails.push({0: r1});
		this.rails.push({0: r2});

		for(int i=0; i<40; i++) {
			generateNext(2 * Math.floor(i / 7) + 1);
		}

		display();
	}

	connectRails(railA, indexA, railB, indexB) {
		railA.addTo(indexB);
		railB.addFrom(indexA);
	}
	
	generateNext(width) {
		var half = Math.floor(width / 2);
		
		var rails = {};
		for(i=-half; i<=half; i++) {
			rails[i] = new RailPiece();
		}
		this.rails.push(rails);

		var railsBefore = this.rails[this.rails.length-2];
		for(railIndex in Object.keys(railsBefore)) {
			while(Math.random() > 0.5) {
				var connectTo = Math.round(railIndex + (Math.random() * 2 - 1));

				if(rails[connectTo] == undefined) {
					continue;
				}

				if(railsBefore[railIndex].isConnectedTo(connectTo)) {
					continue;
				}

				connectRails(railsBefore[railIndex], railIndex, rails[connectTo], connectTo);
			}
		}
	}

	display() {
		//clear
		for (var i = this.children.length - 1; i >= 0; i--) {
			this.removeChild(this.children[i]);
		}

		//add rails
		for(int i=0; i<this.rails.length; i++) {
			var rails = this.rails[i];
			for(railIndex in Object.keys(rails)) {
				var railPiece = rails[railIndex];

				if(!railPiece.isEmpty) {
					var railSprite = new PIXI.Graphics();

					displayRailPiece(railSprite, railPiece, railIndex);

					railSprite.x = i * 100;
					railSprite.y = railIndex * 50;
					railSprite.anchor.x = 0.5;
					railSprite.anchor.y = 0.5;

					this.addChild(railSprite);
				}
			}
		}
	}

	displayRailPiece(railSprite, railPiece, railIndex) {
		railSprite.width = 100;
		railSprite.height = 50;

		for(toRailIndex in railPiece.to) {
			var h = toRailIndex - railIndex;

			railSprite.lineStyle(5, 0xffffff);
			railSprite.moveTo(50, 25);
			railSprite.lineTo(100, 50 + h * 25);
			railSprite.endFill();
		}

		for(fromRailIndex in railPiece.from) {
			var h = fromRailIndex - railIndex;

			railSprite.lineStyle(5, 0xffffff);
			railSprite.moveTo(50, 25);
			railSprite.lineTo(0, 50 + h * 25);
			railSprite.endFill();
		}
	}
}