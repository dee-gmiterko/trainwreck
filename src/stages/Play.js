import World from '../world/World';
import Train from '../world/Train';
import SwitchCursor from '../world/SwitchCursor';

export default class StagePlay extends PIXI.Container {

	constructor(stages, settings) {
		super();
		
		this.stages = stages;
		this.settings = settings;
		this.cameraPosPercentage = 0.21;
	}

	load() {
		this.world = new World();
		this.world.y = this.settings.height / 2;

		this.train = new Train(this.world, 0, 0, Train.RIGHT);
		this.train.x = World.PIECE_WIDTH2;
		this.train.y = this.settings.height / 2 + World.PIECE_HEIGHT2;

		this.switchCursor = new SwitchCursor(this.world);

		this.addChild(this.world);
		this.addChild(this.train);
		this.addChild(this.switchCursor);

		this.interactive=true;
		this.on('mousedown', () => {
			this.train.addCart();
		});
	}

	tick() {
		this.train.move();

		//move camera
		if(this.train.children[0].x > this.cameraPosPercentage * this.settings.width) {
			var camPos = this.cameraPosPercentage * this.settings.width - this.train.children[0].x;
			this.world.x = camPos;
			this.train.x = camPos + World.PIECE_WIDTH2;
		}
	}

	unload() {
		this.removeChild(this.world);
		this.removeChild(this.switchCursor);
		
		this.world = undefined;
		this.switchCursor = undefined;
	}
}
