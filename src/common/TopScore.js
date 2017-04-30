export default class TopScore {

	constructor() {
		if(!window.localStorage.topScore) {
			window.localStorage.topScore = JSON.stringify([]);
		}
		this.topScore = JSON.parse(window.localStorage.topScore);
	}

	addScore(score) {
		this.topScore.push(score);
		this.topScore.sort((a, b) => {return parseInt(b, 10) - parseInt(a, 10)});
		window.localStorage.topScore = JSON.stringify(this.topScore);
	}

	getTop(count) {
		return this.topScore.slice(0, count);
	}
}