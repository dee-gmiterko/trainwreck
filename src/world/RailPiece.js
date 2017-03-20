export default class RailPiece {

	constructor() {
		this.to = [];
		this.from = [];
		this.isSwitch = false;
		this.isEmpty = true;
		this.isVagon = false;
	}

	addFrom(railIndex) {
		this.from.push(railIndex);
		this.isEmpty = false;
		this.isSwitch = this.from.length + this.to.length >= 2;
	}

	addTo(railIndex) {
		this.to.push(railIndex);
		this.isEmpty = false;
		this.isSwitch = this.from.length + this.to.length >= 2;
	}

	isConnectedTo(railIndex) {
		return this.to.indexOf(railIndex) >= 0;
	}

	getTo() {
		return this.to[0];
	}

	getFrom() {
		return this.from[0];
	}
}