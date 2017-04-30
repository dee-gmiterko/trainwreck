import KeyListener from '../common/KeyListener';

export default class StageTopScore extends PIXI.Container {

	constructor(stages, topScore, settings) {
		super();

		this.stages = stages;
		this.topScore = topScore;
		this.settings = settings;

		this.myScore = undefined;
	}

	addScore(score) {
		this.topScore.addScore(score);
		this.myScore = this.topScore.getTop(100).indexOf(score);
	}

	load() {
		this.background = new PIXI.Graphics();
		this.background.beginFill(StageTopScore.BACKGROUND_COLOR);
		this.background.drawRect(0, 0, this.settings.width, this.settings.height);
		
		this.scores = new PIXI.Container();
		var i = 0;
		this.topScore.getTop(100).forEach(score => {

			var x = i % 10;
			var y = Math.floor(i / 10);

			var color = '#E1303C';
			if(this.myScore != undefined && this.myScore == i) {
				color = '#9FBC12';
			}

			var scoreText = new PIXI.Text(score, new PIXI.TextStyle({fontSize: 14, fill: color}));
			scoreText.x = (x+1) * (this.settings.width / (10 + 1));
			scoreText.y = (y+1) * (this.settings.height / (5 + 1));
			scoreText.anchor.x = 0.5;
			scoreText.anchor.y = 0.5;

			this.scores.addChild(scoreText);
			i++;
		});
		
		this.crashedTextGuide = new PIXI.Text("Press space to continue", new PIXI.TextStyle({fontSize: 14, fill: '#9FBC12'}));
		this.crashedTextGuide.x = this.settings.width / 2;
		this.crashedTextGuide.y = this.settings.height;
		this.crashedTextGuide.anchor.x = 0.5;
		this.crashedTextGuide.anchor.y = 1.5;

		this.addChild(this.background);
		this.addChild(this.scores);
		this.addChild(this.crashedTextGuide);

		this.keySpace = new KeyListener(32);
	}

	tick() {
		if(this.keySpace.isDown) {
			this.stages.changeStage("play");
		}
	}

	unload() {
		this.removeChild(this.background);
		this.removeChild(this.scores);
		this.removeChild(this.crashedTextGuide);
		
		this.keySpace.close();

		this.keySpace = undefined;

		this.background = undefined;
		this.scores = undefined;
		this.crashedTextGuide = undefined;
	}
}

StageTopScore.BACKGROUND_COLOR = 0xFFFFFF;