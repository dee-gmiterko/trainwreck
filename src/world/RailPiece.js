export default class RailPiece {

	constructor() {
		this.to = [];
		this.from = [];
		this.isSwitch = false;
		this.isEmpty = true;
		this.isCart = false;
	}

	addFrom(railIndex) {
		this.from.push(railIndex);
		this.isEmpty = false;
		this.isSwitch = this.railsCount() > 2;
	}

	addTo(railIndex) {
		this.to.push(railIndex);
		this.isEmpty = false;
		this.isSwitch = this.railsCount() > 2;
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

	railsCount() {
		return this.from.length + this.to.length
	}
}