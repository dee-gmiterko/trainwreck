import App from './App';

var settings = {
	width: window.innerWidth,
	height: window.innerHeight,
	scale: Math.min(window.innerWidth / 700, window.innerHeight / 400)
}

window.app = new App(settings);
window.app.start();
