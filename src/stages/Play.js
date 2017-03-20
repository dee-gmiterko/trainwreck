import UiQuestionInput from '../ui/questionInput/UiQuestionInput';

import World from '../world/World';
import Train from '../world/Train';

export default class StagePlay extends PIXI.Container {

	constructor(stages, settings) {
		this.stages = stages;
		this.settings = settings;
		
		this.world = new World();
		// this.train = new Train(this.world, 0, 0, Train.RIGHT);

		this.switchCursor = new SwitchCursor(this.world);

		this.addChild(this.world);
		this.addChild(this.switchCursor);
	}

	tick() {
		this.world.x -= 1;
	}

	unload() {

	}
}
