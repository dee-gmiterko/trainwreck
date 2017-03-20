import World from '../world/World';
import Train from '../world/Train';
import SwitchCursor from '../world/SwitchCursor';

export default class StagePlay extends PIXI.Container {

	constructor(stages, settings) {
		super();
		
		this.stages = stages;
		this.settings = settings;
	}

	load() {
		this.world = new World();
		this.world.y = this.settings.height / 2;

		this.train = new Train(this.world, 0, 0, Train.RIGHT);

		this.switchCursor = new SwitchCursor(this.world);

		this.addChild(this.world);
		this.addChild(this.switchCursor);
	}

	tick() {
		this.world.x -= 1;
	}

	unload() {
		this.removeChild(this.world);
		this.removeChild(this.switchCursor);
		
		this.world = undefined;
		this.switchCursor = undefined;
	}
}
