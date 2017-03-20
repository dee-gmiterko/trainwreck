import World from './World';

export default class Train extends PIXI.Container {

	constructor(world, x, y, direction) {
		super();

		this.world = world;
		this.direction = direction;
		this.speed = 1;

		this.addCart();

		var locomotive = this.children[0];
		locomotive.x = 0;
		locomotive.y = 0;
		
		this.recalculatePath();
	}

	move() {
		var getY = (x) => {
			var y1 = World.PIECE_HEIGHT * this.path[Math.floor(x / World.PIECE_WIDTH)];
			var y2 = Train.CART_OFFSET_Y + World.PIECE_HEIGHT * this.path[Math.floor(x / World.PIECE_WIDTH) + 1];
			var t = (x % World.PIECE_WIDTH) / World.PIECE_WIDTH;
			return y1 + t * (y2 - y1);
		}
		var getAngle = (x) => {
			var y1 = World.PIECE_HEIGHT * this.path[Math.floor(x / World.PIECE_WIDTH)];
			var y2 = World.PIECE_HEIGHT * this.path[Math.floor(x / World.PIECE_WIDTH) + 1];
			return Math.tan((y2 - y1) / World.PIECE_WIDTH);
		}

		//move locomotive
		var locomotive = this.children[0];
		locomotive.x += this.direction * this.speed;
		locomotive.y = getY(locomotive.x);
		locomotive.rotation = getAngle(locomotive.x);
		
		//move other carts
		for(var i = 1; i < this.children.length; i++) {
			var dx = this.children[i].x - this.children[i-1].x;
			var dy = this.children[i].y - this.children[i-1].y;
			var l = Train.CART_DELAY / Math.sqrt(dx * dx + dy * dy);
			dx = dx * l;
			dy = dy * l;
			this.children[i].x = this.children[i-1].x + dx;
			this.children[i].y = this.children[i-1].y + dy;
		}
	}

	addCart() {
		var cartContainer = new PIXI.Sprite();
		
		var cart = new PIXI.Graphics();
		cart.width = Train.CART_WIDTH;
		cart.width = Train.CART_HEIGHT;
		cart.beginFill(0xFFFF00);
		cart.drawRect(0, 0, Train.CART_WIDTH, Train.CART_HEIGHT);

		cartContainer.anchor.x = 0.5;
		cartContainer.anchor.y = 0.5;

		cartContainer.addChild(cart);
		this.addChild(cartContainer);
	}

	removeCart() {
		this.removeChild(this.children[this.children.length-1]);
	}

	recalculatePath() {
		if(this.path) {
			var x = Math.floor(this.children[0].x / World.PIECE_WIDTH);
			this.path = this.world.getPath(x, this.path[x], this.direction);
		} else {
			this.path = this.world.getPath(0, 0, this.direction);
		}
	}
}

Train.LEFT = -1;
Train.RIGHT = 1;

Train.CART_WIDTH = 30;
Train.CART_HEIGHT = 10;
Train.CART_DELAY = 32;