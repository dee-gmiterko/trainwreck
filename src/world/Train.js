import World from './World';

export default class Train extends PIXI.Container {

	constructor(world, x, y, direction) {
		super();

		this.world = world;
		this.direction = direction;
		this.speed = 1;

		this.addCart();

		this.locomotive = this.children[0];
		this.locomotive.x = 0;
		this.locomotive.y = 0;
		
		this.path = this.world.getPath(0, 0, this.direction);
	}

	move() {
		var getY = (x) => {
			var y1 = World.PIECE_HEIGHT * this.path[Math.floor(x / World.PIECE_WIDTH)];
			var y2 = World.PIECE_HEIGHT * this.path[Math.floor(x / World.PIECE_WIDTH) + 1];
			var t = (x % World.PIECE_WIDTH) / World.PIECE_WIDTH;
			return y1 + t * (y2 - y1);
		}
		var getAngle = (x) => {
			var y1 = getY(x - Train.CART_WIDTH2);
			var y2 = getY(x + Train.CART_WIDTH2);
			return Math.tan((y2 - y1) / Train.CART_WIDTH);
		}

		//move locomotive
		this.locomotive.x += this.direction * this.speed;
		this.locomotive.y = getY(this.locomotive.x);
		this.locomotive.rotation = getAngle(this.locomotive.x);
		
		//move other carts
		for(var i = 1; i < this.children.length; i++) {
			var dx = this.children[i].x - this.children[i-1].x;
			var dy = this.children[i].y - this.children[i-1].y;
			var l = Train.CART_DELAY / Math.sqrt(dx * dx + dy * dy);
			dx = dx * l;
			dy = dy * l;
			this.children[i].x = this.children[i-1].x + dx;
			this.children[i].y = this.children[i-1].y + dy;
			this.children[i].rotation = getAngle(this.children[i].x);

			var skew = this.children[i].y - getY(this.children[i].x);

			if(Math.abs(skew) > Train.CART_MAX_SKEW) {
				this.children[i].y = getY(this.children[i].x) + Math.sign(skew) * Train.CART_MAX_SKEW;
				skew = Math.sign(skew) * Train.CART_MAX_SKEW;
			}

			this.children[i].children[0].y = -Train.CART_HEIGHT2 - skew;
		}
	}

	addCart() {
		var cartContainer = new PIXI.Sprite();
		
		var cartBottom = new PIXI.Graphics();
		cartBottom.width = Train.CART_WIDTH;
		cartBottom.height = Train.CART_HEIGHT;
		cartBottom.beginFill(0x999900);
		cartBottom.drawRect(0, 0, Train.CART_WIDTH, Train.CART_HEIGHT);

		cartBottom.x = -Train.CART_WIDTH2;
		cartBottom.y = -Train.CART_HEIGHT2;

		cartContainer.addChild(cartBottom);

		var cartTop = new PIXI.Graphics();
		cartTop.width = Train.CART_WIDTH;
		cartTop.height = Train.CART_HEIGHT;
		cartTop.beginFill(0xFFFF00);
		cartTop.drawRect(0, 0, Train.CART_WIDTH, Train.CART_HEIGHT);

		cartTop.x = -Train.CART_WIDTH2;
		cartTop.y = -Train.CART_HEIGHT2;

		cartContainer.addChild(cartTop);

		cartContainer.x = -9999999;
		cartContainer.y = 0;

		this.addChild(cartContainer);
	}

	removeCart() {
		this.removeChild(this.children[this.children.length-1]);
	}

	recalculatePath(from) {
		if(from === undefined) {
			from = Math.floor(this.children[0].x / World.PIECE_WIDTH);
		}
		this.world.getPath(from, this.path[from], this.direction, this.path);
	}
}

Train.LEFT = -1;
Train.RIGHT = 1;

Train.CART_WIDTH = 30;
Train.CART_HEIGHT = 10;
Train.CART_WIDTH2 = Train.CART_WIDTH / 2;
Train.CART_HEIGHT2 = Train.CART_HEIGHT / 2;
Train.CART_DELAY = 32;
Train.CART_MAX_SKEW = Train.CART_HEIGHT / 3;