import { CustomPIXIComponent } from "react-pixi-fiber";
import chroma from "chroma-js";
import railEasingIn from 'eases/sine-in';
import railEasingOut from 'eases/sine-out';
import * as PIXI from 'pixi.js';
import * as config from"../../config";

const TYPE = "Cart";
export const behavior = {
  customDisplayObject: (props) => {
    const { train, cart } = props;
    const instance = new PIXI.Container();

    let color, colorDark;
    if(train.isEnemy) {
			color = chroma(config.ENEMY_COLOR).num();
  		colorDark = chroma(config.ENEMY_COLOR).darken(0.5).num();
		} else {
			color = chroma(config.PLAYER_COLOR).num();
  		colorDark = chroma(config.PLAYER_COLOR).darken(0.5).num();
		}

    const cartBottom = new PIXI.Graphics();
    cartBottom.width = config.CART_WIDTH;
    cartBottom.height = config.CART_HEIGHT;
    cartBottom.beginFill(colorDark);
    cartBottom.drawRect(0, 0, config.CART_WIDTH, config.CART_HEIGHT);

    cartBottom.x = -config.CART_WIDTH2;
    cartBottom.y = -config.CART_HEIGHT2;

    instance.addChild(cartBottom);

    const cartTop = new PIXI.Graphics();
    cartTop.width = config.CART_WIDTH;
    cartTop.height = config.CART_HEIGHT;
    cartTop.beginFill(color);
    cartTop.drawRect(0, 0, config.CART_WIDTH, config.CART_HEIGHT);

    cartTop.x = -config.CART_WIDTH2;
    cartTop.y = -config.CART_HEIGHT2;

    instance.addChild(cartTop);

    instance.x = cart.x;
    instance.y = cart.y;
    instance.rotation = cart.rotation;

    return instance;
  },
  customApplyProps: (instance, oldProps, newProps) => {
    const { train, cart } = newProps;
    const { x, y, rotation, skew } = cart;
    instance.x = x;
    instance.y = y;
    instance.rotation = rotation;
    instance.children[0].y = -config.CART_HEIGHT2 - (
      skew * Math.min(1, Math.sqrt(train.speed))
    );
  }
};
export default CustomPIXIComponent(behavior, TYPE);
