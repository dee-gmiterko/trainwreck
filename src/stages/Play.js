import World from '../world/World';
import Train from '../world/Train';
import SwitchCursor from '../world/SwitchCursor';
import KeyListener from '../common/KeyListener';

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

		this.switchCursor = new SwitchCursor(this.train);
		this.switchCursor.y = this.settings.height / 2;

		this.cartsText = new PIXI.Text("0", new PIXI.TextStyle({fontSize: 40, fill: '#FFFFFF'}));
		this.cartsText.x = 16;
		this.cartsText.y = 16;

		this.addChild(this.world);
		this.addChild(this.train);
		this.addChild(this.switchCursor);
		this.addChild(this.cartsText);

		this.keyUp = new KeyListener(38);
		this.keyDown = new KeyListener(40);
		this.keyLeft = new KeyListener(37);
		this.keyRight = new KeyListener(39);
	}

	tick() {
		this.train.move();
		this.switchCursor.recalculatePosition();

		//move camera
		if(this.train.children[0].x > this.cameraPosPercentage * this.settings.width) {
			var camPos = this.cameraPosPercentage * this.settings.width - this.train.children[0].x;
			this.world.x = camPos;
			this.train.x = camPos + World.PIECE_WIDTH2;
			this.switchCursor.x = camPos;
		}

		if(this.keyUp.isDown) {
			this.switchCursor.switchCursor(0);
		}
		if(this.keyDown.isDown) {
			this.switchCursor.switchCursor(1);
		}
		if(this.keyLeft.isDown) {
			this.train.speed -= Train.SPEED_CHANGE_STEP;
		}
		if(this.keyRight.isDown) {
			this.train.speed += Train.SPEED_CHANGE_STEP;
		}

		this.cartsText.text = this.train.getCartCount();
	}

	unload() {
		this.removeChild(this.world);
		this.removeChild(this.train);
		this.removeChild(this.switchCursor);
		
		this.keyUp.close();
		this.keyDown.close();
		this.keyLeft.close();
		this.keyRight.close();

		this.keyUp = undefined;
		this.keyDown = undefined;
		this.keyLeft = undefined;
		this.keyRight = undefined;

		this.world = undefined;
		this.train = undefined;
		this.switchCursor = undefined;
	}
}
