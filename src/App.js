import Stages from './common/Stages';
import StageMenu from './stages/Menu';
import StagePlay from './stages/Play';

export default class App {

	constructor(settings) {
		PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

		this.settings = settings;
		this.stages = new Stages();
		
		this.stages.addStage("menu", new StageMenu(this.stages, settings));
		this.stages.addStage("play", new StagePlay(this.stages, settings));
		this.stages.changeStage("play");

	}

	start() {
		var setup = () => {
			var renderer = PIXI.autoDetectRenderer(this.settings.width, this.settings.height);
			document.body.appendChild(renderer.view);

			var gameLoop = () => {
				requestAnimationFrame(gameLoop);
				this.stages.beforeRender();
				renderer.render(this.stages.current);
			}
			gameLoop();

		}

		PIXI.loader
		.add("images/anyImage.png")
		.load(setup);
	}

}