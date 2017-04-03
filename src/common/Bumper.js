export default class Bumper {

	constructor(onEnd) {
		this.onEnd = onEnd;
	}

	show() {
		this.video = document.createElement('video');

		this.video.src = 'media/bumper.mov';
		this.video.play();

		if(this.onEnd) {
			this.video.addEventListener('ended', this.onEnd);
		}

		document.body.appendChild(this.video);
	}

	hide() {
		this.video.style.display = "none";
	}

}