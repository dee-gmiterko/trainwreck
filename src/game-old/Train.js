import chroma from 'chroma-js';
import * as config from "../config";

export default class Train {

	constructor(world, x, y, direction, enemy) {

		this.world = world;
		this.direction = direction;
		this.speed = config.INITIAL_SPEED;
		this.isCrashed = false;

		this.isEnemy = enemy;
		var color;
		if(enemy) {
			color = config.ENEMY_COLOR;
		} else {
			color = config.PLAYER_COLOR;
		}
		this.color = chroma(color).num();
		this.colorDark = chroma(color).darken(0.5).num();

		this.addCart();

		this.locomotive = this.children[0];
		this.locomotive.x = x * config.PIECE_WIDTH + config.PIECE_WIDTH * this.direction;
		this.locomotive.y = y * config.PIECE_HEIGHT;

		this.path = this.world.getPath(x, y, this.direction);
	}

	move() {
		var pieceX = Math.floor(this.locomotive.x / config.PIECE_WIDTH);

		if(!this.isCrashed && this.path[pieceX] !== undefined) {

			if(this.speed > config.INITIAL_SPEED) {
				this.speed -= config.FRICTION;
			}

			var getY = (x) => {
				if(x < 0) {
					return 0;
				}
				var y1 = config.PIECE_HEIGHT * this.path[Math.floor(x / config.PIECE_WIDTH)];
				var y2 = config.PIECE_HEIGHT * this.path[Math.floor(x / config.PIECE_WIDTH) + 1];
				if(Object.is(y2, NaN)) {
					y2 = y1;
				}
				var t = (x % config.PIECE_WIDTH) / config.PIECE_WIDTH;
				return y1 + t * (y2 - y1);
			}
			var getAngle = (x) => {
				if(x < 0) {
					return 0;
				}
				var y1 = getY(x - config.CART_WIDTH2);
				var y2 = getY(x + config.CART_WIDTH2);
				return Math.atan((y2 - y1) / config.CART_WIDTH);
			}

			//move locomotive
			this.locomotive.x += this.direction * this.speed;
			this.locomotive.y = getY(this.locomotive.x);
			this.locomotive.rotation = getAngle(this.locomotive.x);

			//check for cart on rail
			var checkPieceX = Math.round(this.locomotive.x / config.PIECE_WIDTH);
			var checkPieceY = this.path[checkPieceX];
			if(this.world.rails[checkPieceX] && this.world.rails[checkPieceX][checkPieceY] && this.world.rails[checkPieceX][checkPieceY].isCart) {
				this.addCart();
				this.world.rails[checkPieceX][checkPieceY].isCart = false;
				this.world.updateRailPiece(checkPieceX, checkPieceY);
			}

			//move other carts
			for(let i = 1; i < this.children.length; i++) {
				let dx = this.children[i].x - this.children[i-1].x;
				let dy = this.children[i].y - this.children[i-1].y;
				let l= config.CART_DELAY / Math.sqrt(dx * dx + dy * dy);
				dx *= l;
				dy *= l;
				this.children[i].x = this.children[i-1].x + dx;
				this.children[i].y = this.children[i-1].y + dy;
				this.children[i].rotation = getAngle(this.children[i].x);

				var skew = this.children[i].y - getY(this.children[i].x);

				if(Math.abs(skew) > config.CART_MAX_SKEW) {
					this.children[i].y = getY(this.children[i].x) + Math.sign(skew) * config.CART_MAX_SKEW;
					skew = Math.sign(skew) * config.CART_MAX_SKEW;
				}

				this.children[i].children[0].y = -config.CART_HEIGHT2 - skew;
			}

			//test other train collision
			this.world.trains.children.forEach(train => {
				if(train === this) {
					return;
				}
				if(train.isCrashed) {
					return;
				}
				if(this.isEnemy === train.isEnemy) {
					return;
				}
				train.children.forEach(cart => {
					var dx = cart.x - this.locomotive.x;
					var dy = cart.y - this.locomotive.y;
					if(Math.sqrt(dx*dx+dy*dy) < (this.isEnemy ? config.TRAIN_CRASH_DISTANCE * 0.81 : config.TRAIN_CRASH_DISTANCE)) {

						let meCarts = this.children.length - train.children.length;
						let itCarts = train.children.length - this.children.length;

						let hard = (meCarts < 1 && itCarts >= 1) || (meCarts >= 1 && itCarts < 1);

						if(meCarts < 1) {
							this.setCarts(1);
							this.onCrash();
							this.speed = Math.max(this.speed, train.speed);
							if(hard) {
								this.locomotive.rotation += Math.min(1, this.speed) * Math.PI / 4;
							} else {
								this.speed *= -1;
							}
						} else {
							this.setCarts(meCarts);
						}

						if(itCarts < 1) {
							train.setCarts(1);
							train.onCrash();
							train.speed = Math.max(this.speed, train.speed);
							if(hard) {
								train.locomotive.rotation += Math.min(1, train.speed) * -Math.PI / 4;
							} else {
								train.speed *= -1;
							}
						} else {
							train.setCarts(itCarts);
						}
					}
				});
			});

		} else {
			if(!this.isCrashed) {
				this.onCrash();
			}

			//move locomotive
			this.speed *= config.FRICTION_CRASHED_MOD;
			this.locomotive.rotation += Math.min(3, this.speed) * (Math.random() - 0.5) * 0.2;
			this.locomotive.x += this.speed * Math.cos(this.locomotive.rotation);
			this.locomotive.y += this.speed * Math.sin(this.locomotive.rotation);

			//move other carts
			for(let i = 1; i < this.children.length; i++) {
				let dx = this.children[i].x - this.children[i-1].x;
				let dy = this.children[i].y - this.children[i-1].y;
				let l = config.CART_DELAY / Math.sqrt(dx * dx + dy * dy);
				dx *= l;
				dy *= l;
				this.children[i].x = this.children[i-1].x + dx;
				this.children[i].y = this.children[i-1].y + dy;
				this.children[i].rotation = Math.min(Math.max(Math.atan(dy / dx), -1), 1);
			}
		}
	}

	onCrash() {
		if(this.isCrashed) {
			return;
		}

		this.isCrashed = true;

		if(this.isEnemy) {
			setTimeout(() => {this.world.trains.removeChild(this)}, 3000);
		}
	}

	addCart() {
		var cartContainer = new PIXI.Sprite();

		var cartBottom = new PIXI.Graphics();
		cartBottom.width = config.CART_WIDTH;
		cartBottom.height = config.CART_HEIGHT;
		cartBottom.beginFill(this.colorDark);
		cartBottom.drawRect(0, 0, config.CART_WIDTH, config.CART_HEIGHT);

		cartBottom.x = -config.CART_WIDTH2;
		cartBottom.y = -config.CART_HEIGHT2;

		cartContainer.addChild(cartBottom);

		var cartTop = new PIXI.Graphics();
		cartTop.width = config.CART_WIDTH;
		cartTop.height = config.CART_HEIGHT;
		cartTop.beginFill(this.color);
		cartTop.drawRect(0, 0, config.CART_WIDTH, config.CART_HEIGHT);

		cartTop.x = -config.CART_WIDTH2;
		cartTop.y = -config.CART_HEIGHT2;

		cartContainer.addChild(cartTop);

		cartContainer.x = -9999999 * this.direction;
		cartContainer.y = 0;

		this.addChild(cartContainer);
	}

	removeCart() {
		this.removeChild(this.children[this.children.length-1]);
	}

	setCarts(count) {
		while(this.children.length < count) {
			this.addCart();
		}
		while(this.children.length > count) {
			this.removeCart();
		}
	}

	recalculatePath(from) {
		if(from === undefined) {
			from = Math.floor(this.children[0].x / config.PIECE_WIDTH);
		}
		this.world.getPath(from, this.path[from], this.direction, this.path);
	}

	getCartCount() {
		return this.children.length;
	}

	accelerate() {
		if(config.MAX_SPEED === undefined || this.speed < config.MAX_SPEED) {
			this.speed += config.SPEED_CHANGE_BASE * Math.pow(config.SPEED_CHANGE_DROP_PER_CART, this.getCartCount());
		}
	}

	decelerate() {
		if(config.MIN_SPEED === undefined || this.speed > config.MIN_SPEED) {
			this.speed -= config.SPEED_CHANGE_BASE * Math.pow(config.SPEED_CHANGE_DROP_PER_CART, this.getCartCount());
		}
	}
}
