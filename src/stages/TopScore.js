import KeyListener from '../common/KeyListener';

export default class StageTopScore extends PIXI.Container {

	constructor(stages, topScore, settings) {
		super();

		this.stages = stages;
		this.topScore = topScore;
		this.settings = settings;

		this.myScore = -1;
	}

	addScore(score) {
		this.topScore.addScore(score);
		this.myScore = this.topScore.getTop(StageTopScore.TOP_COUNT).indexOf(score);
	}

	load() {
		this.background = new PIXI.Graphics();
		this.background.beginFill(StageTopScore.BACKGROUND_COLOR);
		this.background.drawRect(0, 0, this.settings.width, this.settings.height);
		
		this.scores = new PIXI.Container();
		var i = 0;
		this.topScore.getTop(StageTopScore.TOP_COUNT).forEach(score => {

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
		this.crashedTextGuide.y = this.settings.height - 16;
		this.crashedTextGuide.anchor.x = 0.5;
		this.crashedTextGuide.anchor.y = 1;

		this.gameByText = new PIXI.Text("Game by Dominik Gmiterko", new PIXI.TextStyle({fontSize: 10, fill: '#9FBC12'}));
		this.gameByText.x = 16;
		this.gameByText.y = this.settings.height - 16;
		this.gameByText.anchor.x = 0.0;
		this.gameByText.anchor.y = 1.0;

		this.gameAtText = new PIXI.Text("play at ienze.me/trainwreck", new PIXI.TextStyle({fontSize: 10, fill: '#9FBC12'}));
		this.gameAtText.x = this.settings.width - 16;
		this.gameAtText.y = this.settings.height - 16;
		this.gameAtText.anchor.x = 1.0;
		this.gameAtText.anchor.y = 1.0;

		this.addChild(this.background);
		this.addChild(this.scores);
		this.addChild(this.crashedTextGuide);
		this.addChild(this.gameByText);
		this.addChild(this.gameAtText);

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
		this.removeChild(this.gameByText);
		this.removeChild(this.gameAtText);
		
		this.keySpace.close();

		this.keySpace = undefined;

		this.background = undefined;
		this.scores = undefined;
		this.crashedTextGuide = undefined;
		this.gameByText = undefined;
		this.gameAtText = undefined;
	}
}

StageTopScore.BACKGROUND_COLOR = 0xFFFFFF;
StageTopScore.TOP_COUNT = 40;