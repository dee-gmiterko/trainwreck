import * as config from '../config';

export default class RailPiece {

	constructor() {
		this.to = [];
		this.from = [];
		this.isSwitch = false;
		this.isEmpty = true;
		this.isCart = false;
		this.switched = {
			from: undefined,
			to: undefined
		}
	}

	addTo(railIndex) {
		this.to.push(railIndex);
		this.to.sort((a, b) => {return a-b;});
		this.onRailAdded();
	}

	addFrom(railIndex) {
		this.from.push(railIndex);
		this.from.sort((a, b) => {return a-b;});
		this.onRailAdded();
	}

	onRailAdded() {
		this.isEmpty = false;
		this.isSwitch = this.railsCount() > 2;
		if(this.isSwitch) {
			this.switched = {
				from: Math.floor(Math.random() * this.from.length),
				to: Math.floor(Math.random() * this.to.length)
			}
		}
	}

	isConnectedTo(railIndex) {
		return this.to.indexOf(railIndex) >= 0;
	}

	switchPrefered(preferedDirection, value) {
		if(preferedDirection === config.RIGHT) {
			if(this.to.length >= 2) {
				this.switchTo(value);
			} else {
				this.switchFrom(value);
			}
		} else {
			if(this.from.length >= 2) {
				this.switchFrom(value);
			} else {
				this.switchTo(value);
			}
		}
	}

	switchTo(value) {
		this.switched.to = value;
	}

	switchFrom(value) {
		this.switched.from = value;
	}

	railsCount() {
		return this.from.length + this.to.length
	}

	getData() {
		return {
			to: this.to,
			from: this.from,
			isSwitch: this.isSwitch,
			isEmpty: this.isEmpty,
			isCart: this.isCart,
			switched: this.switched,
		}
	}
}
