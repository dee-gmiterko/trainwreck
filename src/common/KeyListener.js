export default class KeyListener {
	
	constructor(keyCode, press, release) {
		this.code = keyCode;
		this.isDown = false;
		this.isUp = true;
		this.press = press;
		this.release = release;

		this.downHandler = event => {
			if (event.keyCode === this.code) {
				if (this.isUp && this.press) this.press();
				this.isDown = true;
				this.isUp = false;
				event.preventDefault();
			}
		}

		this.upHandler = event => {
			if (event.keyCode === this.code) {
				if (this.isDown && this.release) this.release();
				this.isDown = false;
				this.isUp = true;
				event.preventDefault();
			}
		}

		window.addEventListener("keydown", this.downHandler, false);
		window.addEventListener("keyup", this.upHandler, false);
	}

	close() {
		window.removeEventListener("keydown",  this.downHandler);
		window.removeEventListener("keyup", this.upHandler);
	}
}