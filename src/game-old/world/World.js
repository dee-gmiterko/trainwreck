import railEasingIn from 'eases/sine-in';
import railEasingOut from 'eases/sine-out';
import Train from './Train';
import WorldGenerator from './WorldGenerator';

export default class World extends PIXI.Container {

	constructor() {
		super();

		this.rails = rails;

		this.displayed = {
			from: 0,
			to: 0
		};

		this.map = new PIXI.Container();
		this.addChild(this.map);

		this.trains = new PIXI.Container();
		this.trains.x = config.PIECE_WIDTH2;
		this.trains.y = config.PIECE_HEIGHT2;
		this.addChild(this.trains);

		this.clamp(0, 60);

		this.trains.addChild(new Train(this, 0, 0, Train.RIGHT, false));

	}

	
}
