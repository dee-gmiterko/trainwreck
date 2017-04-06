import Stages from './common/Stages';
import StageMenu from './stages/Menu';
import StagePlay from './stages/Play';
import Bumper from './common/Bumper';
import KeyListener from './common/KeyListener';

export default class App {

	constructor(settings) {
		this.settings = settings;
		this.stages = new Stages();

		var bumperClose = () => {
			this.run = true;
			if(this.setuped) {
				this.gameLoop();
			}
			this.bumper.hide();
		};

		this.bumper = new Bumper(bumperClose);
		
		this.stages.addStage("menu", new StageMenu(this.stages, settings));
		this.stages.addStage("play", new StagePlay(this.stages, settings));
		this.stages.changeStage("play");

		if(settings.app_bumper) {
			this.bumper.show();
		} else {
			this.run = true;
		}

		new KeyListener(32, bumperClose);
	}

	start() {
		var setup = () => {
			this.setuped = true;

			this.renderer = PIXI.autoDetectRenderer(this.settings.width, this.settings.height);
			document.body.appendChild(this.renderer.view);

			this.gameLoop = () => {
				requestAnimationFrame(this.gameLoop);
				this.stages.beforeRender();
				this.renderer.render(this.stages.current);
			}

			if(this.run) {
				this.gameLoop();
			}
		}

		PIXI.loader
		.add("images/anyImage.png")
		.load(setup);
	}

}