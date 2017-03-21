import Train from './Train';

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
		this.to.sort();
		this.onRailAdded();
	}

	addFrom(railIndex) {
		this.from.push(railIndex);
		this.from.sort();
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

	getTo() {
		if(this.isSwitch) {
			return this.to[this.switched.to];
		}
		if(this.to.length > 0) {
			return this.to[0];
		}
		return undefined;
	}

	getFrom() {
		if(this.isSwitch) {
			return this.from[this.switched.from];
		}
		if(this.from.length > 0) {
			return this.from[0];
		}
		return undefined;
	}

	switchPrefered(preferedDirection, value) {
		if(preferedDirection == Train.RIGHT) {
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
}