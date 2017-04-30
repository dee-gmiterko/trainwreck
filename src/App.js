import Stages from './common/Stages';
import StagePlay from './stages/Play';
import StageTopScore from './stages/TopScore';

import TopScore from './common/TopScore';
import Bumper from './common/Bumper';
import KeyListener from './common/KeyListener';

export default class App {

	constructor(settings) {
		this.settings = settings;
		this.stages = new Stages();
		this.topScore = new TopScore();

		var bumperClose = () => {
			if(this.run) {
				return;
			}
			this.run = true;
			if(this.setuped) {
				this.gameLoop();
			}
			this.bumper.hide();
		};

		this.bumper = new Bumper(bumperClose);
		
		this.stages.addStage("play", new StagePlay(this.stages, settings));
		this.stages.addStage("topScore", new StageTopScore(this.stages, this.topScore, settings));
		this.stages.changeStage("topScore");

		if(App.BUMPER) {
			this.bumper.show();
		} else {
			this.run = true;
		}

		new KeyListener(32, bumperClose);
	}

	start() {
		var setup = () => {
			this.setuped = true;

			this.renderer = PIXI.autoDetectRenderer(this.settings.width, this.settings.height, {antialias: true});
			document.body.appendChild(this.renderer.view);

			this.gameLoop = () => {
				this.stages.beforeRender();
				this.renderer.render(this.stages.current);
				requestAnimationFrame(this.gameLoop);
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

App.BUMPER = false;