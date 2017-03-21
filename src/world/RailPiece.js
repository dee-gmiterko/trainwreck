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
				to: Math.floor(Math.random() * this.from.length)
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
		return this.to[0];
	}

	getFrom() {
		if(this.isSwitch) {
			return this.from[this.switched.from];
		}
		return this.from[0];
	}

	switchPrefered(preferedDirection, value) {
		if(preferedDirection == Train.RIGHT) {
			if(this.to.length >= 2) {
				toggleSwitchTo(value);
			} else {
				toggleSwitchFrom(value);
			}
		} else {
			if(this.from.length >= 2) {
				toggleSwitchFrom(value);
			} else {
				toggleSwitchTo(value);
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