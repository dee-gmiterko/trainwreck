import World from '../world/World';
import Train from '../world/Train';
import SwitchCursor from '../world/SwitchCursor';
import KeyListener from '../common/KeyListener';

export default class StagePlay extends PIXI.Container {

	constructor(stages, settings) {
		super();
		
		this.stages = stages;
		this.settings = settings;
	}

	load() {
		this.camOffset = StagePlay.CAMERA_CENTER_PERC * this.settings.width;

		this.background = new PIXI.Graphics();
		this.background.beginFill(StagePlay.BACKGROUND_COLOR);
		this.background.drawRect(0, 0, this.settings.width, this.settings.height);
		
		this.world = new World();
		this.world.y = this.settings.height / 2;

		this.train = this.world.getTrain();

		this.switchCursor = new SwitchCursor(this.train);
		this.switchCursor.y = this.settings.height / 2;

		this.cartsText = new PIXI.Text("0", new PIXI.TextStyle({fontSize: 40, fill: '#9FBC12'}));
		this.cartsText.x = 16;
		this.cartsText.y = 16;

		this.scoreText = new PIXI.Text("0", new PIXI.TextStyle({fontSize: 21, fill: '#9FBC12'}));
		this.scoreText.x = 64;
		this.scoreText.y = 16;

		this.crashedText = new PIXI.Text("Crashed", new PIXI.TextStyle({fontSize: 40, fill: '#247192'}));
		this.crashedText.x = this.settings.width / 2;
		this.crashedText.y = this.settings.height / 2;
		this.crashedText.anchor.x = 0.5;
		this.crashedText.anchor.y = 0.5;
		this.crashedText.visible = false;

		this.crashedTextGuide = new PIXI.Text("Press space to continue", new PIXI.TextStyle({fontSize: 14, fill: '#247192'}));
		this.crashedTextGuide.x = this.settings.width / 2;
		this.crashedTextGuide.y = this.settings.height / 2;
		this.crashedTextGuide.anchor.x = 0.5;
		this.crashedTextGuide.anchor.y = -0.9;
		this.crashedTextGuide.visible = false;

		this.quideText = new PIXI.Text("hold ◀ and ▶ to control train speed, ▲ and ▼ for railroad switches", new PIXI.TextStyle({fontSize: 12, fill: '#9FBC12'}));
		this.quideText.x = this.settings.width / 2;
		this.quideText.y = 0;
		this.quideText.anchor.x = 0.5;
		this.quideText.anchor.y = -1.0;

		this.addChild(this.background);
		this.addChild(this.switchCursor);
		this.addChild(this.world);
		this.addChild(this.cartsText);
		this.addChild(this.scoreText);
		this.addChild(this.crashedText);
		this.addChild(this.crashedTextGuide);
		this.addChild(this.quideText);

		this.keyUp = new KeyListener(38);
		this.keyDown = new KeyListener(40);
		this.keyLeft = new KeyListener(37);
		this.keyRight = new KeyListener(39);
		this.keySpace = new KeyListener(32);
	}

	tick() {
		this.world.trains.children.forEach(train => train.move());

		if(!this.train.isCrashed) {
			this.switchCursor.recalculatePosition();
		}

		//move camera
		var camPos = this.train.locomotive.x - this.camOffset;
		if(this.train.isCrashed) {
			this.camOffset += 0.8;
		}
		if(camPos < 0) {
			camPos = 0;
		}
		camPos += World.PIECE_WIDTH;
		this.world.x = -camPos;
		this.switchCursor.x = -camPos;
		
		//show/hide world
		var c1 = camPos + this.settings.width + 5 * World.PIECE_WIDTH;
		var c2 = camPos - 10 * World.PIECE_WIDTH;
		if(c1 > this.world.displayed.to * World.PIECE_WIDTH || c2 < this.world.displayed.from * World.PIECE_WIDTH) {
			var from = Math.floor(camPos / World.PIECE_WIDTH) - 30;
			var to = from + 100;
			var oldTo = this.world.displayed.to;

			this.world.clamp(from, to);
			
			if(to > oldTo) {
				this.train.recalculatePath(oldTo);
				this.switchCursor.displayPath();
			}
		}

		//controls
		if(!this.train.isCrashed) {
			if(this.keyUp.isDown) {
				this.switchCursor.switchCursor(0);
			}
			if(this.keyDown.isDown) {
				this.switchCursor.switchCursor(1);
			}
			if(this.keyLeft.isDown) {
				if(Train.MIN_SPEED === undefined || this.train.speed > Train.MIN_SPEED) {
					this.train.speed -= Train.SPEED_CHANGE_STEP;
				}
			}
			if(this.keyRight.isDown) {
				if(Train.MAX_SPEED === undefined || this.train.speed < Train.MAX_SPEED) {
					this.train.speed += Train.SPEED_CHANGE_STEP;
				}
			}
		}

		if(this.quideText.alpha > 0 && (this.keyUp.isDown || this.keyDown.isDown || this.keyLeft.isDown || this.keyRight.isDown)) {
			this.quideText.alpha -= 0.01;
		}
		
		this.cartsText.text = this.train.getCartCount();
		var score = Math.floor(this.train.locomotive.x / (World.PIECE_WIDTH * StagePlay.SCORE_SPEED));
		this.scoreText.text = score;

		if(this.train.isCrashed) {
			this.crashedText.visible = true;
			this.crashedTextGuide.visible = true;
		}

		//spawn enemy train
		if(Math.random() < StagePlay.ENEMY_SPAWN_RATE * this.train.speed) {
			var x = Math.floor((this.train.locomotive.x + this.settings.width) / World.PIECE_WIDTH);
			
			var ys = Object.keys(this.world.rails[x]);
			var y = parseInt(ys[Math.floor(Math.random()*ys.length)], 10);

			var enemyTrain = new Train(this.world, x, y, Train.LEFT, true);
			
			while(Math.random() < StagePlay.ENEMY_SPAWN_CARTS_PROB) {
				enemyTrain.addCart();
			}

			this.world.trains.addChild(enemyTrain);
		}

		if(this.keySpace.isDown) {
			if(this.train.isCrashed) {
				var score = Math.floor(this.train.locomotive.x / (World.PIECE_WIDTH * StagePlay.SCORE_SPEED));
				this.stages.getStage("topScore").addScore(score);
				this.stages.changeStage("topScore");
			} else {
				this.restart();
			}
		}
	}

	restart() {
		this.unload();
		this.load();
	}

	unload() {
		this.removeChild(this.background);
		this.removeChild(this.world);
		this.removeChild(this.switchCursor);
		this.removeChild(this.cartsText);
		this.removeChild(this.scoreText);
		this.removeChild(this.crashedText);
		this.removeChild(this.crashedTextGuide);
		this.removeChild(this.quideText);
		
		this.keyUp.close();
		this.keyDown.close();
		this.keyLeft.close();
		this.keyRight.close();
		this.keySpace.close();

		this.keyUp = undefined;
		this.keyDown = undefined;
		this.keyLeft = undefined;
		this.keyRight = undefined;
		this.keySpace = undefined;

		this.background = undefined;
		this.world = undefined;
		this.train = undefined;
		this.switchCursor = undefined;
		this.cartsText = undefined;
		this.scoreText = undefined;
		this.crashedText = undefined;
		this.crashedTextGuide = undefined;
		this.quideText = undefined;
	}
}

StagePlay.SCORE_SPEED = 3;
StagePlay.CAMERA_CENTER_PERC = 0.21;
StagePlay.BACKGROUND_COLOR = 0xFFFFFF;
StagePlay.ENEMY_SPAWN_RATE = 0.002;
StagePlay.ENEMY_SPAWN_CARTS_PROB = 0.2;