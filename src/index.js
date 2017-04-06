import App from './App';

var settings = {
	width: 960,
	height: 144,
	app_bumper: false
}

window.app = new App(settings);
window.app.start();