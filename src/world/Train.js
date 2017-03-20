export default class Train extends PIXI.Container {

	constructor(world, x, y, Train.RIGHT) {
		super();

		this.world = world;
		this.x = World.PIECE_WIDTH * x;
		this.y = World.PIECE_HEIGHT * y;

		addCart();
	}

	move() {

	}

	addCart() {
		var cartContainer = new PIXI.Container();
		
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

	}
}

Train.LEFT = 0;
Train.RIGHT = 1;

Train.CART_WIDTH = 30;
Train.CART_HEIGHT = 10;