import { CustomPIXIComponent } from "react-pixi-fiber";
import railEasingIn from 'eases/sine-in';
import railEasingOut from 'eases/sine-out';
import * as PIXI from 'pixi.js';
import * as config from"../../config";

const render = (instance, x, y, railPiece) => {
  instance.clear();

  const displayRailPieceSegment = (fromX, fromY, toX, toY, railEasing) => {
    var dX = toX-fromX;

    //top rail
    instance.lineStyle(1, config.RAIL_COLOR);
    for(let i=0; i<config.SUBPIECES; i++) {
      instance.moveTo(fromX + ((i-1)/config.SUBPIECES)*dX,
        fromY + railEasing((i-1)/config.SUBPIECES) * (toY - fromY) - config.TRACK_WIDTH2);
      instance.lineTo(fromX + ((i)/config.SUBPIECES)*dX,
        fromY + railEasing((i)/config.SUBPIECES) * (toY - fromY) - config.TRACK_WIDTH2);
    }
    instance.endFill();

    //bottom rail
    instance.lineStyle(1, config.RAIL_COLOR);
    for(let i=0; i<config.SUBPIECES; i++) {
      instance.moveTo(fromX + ((i-1)/config.SUBPIECES)*dX,
        fromY + railEasing((i-1)/config.SUBPIECES) * (toY - fromY) + config.TRACK_WIDTH2);
      instance.lineTo(fromX + ((i)/config.SUBPIECES)*dX,
        fromY + railEasing((i)/config.SUBPIECES) * (toY - fromY) + config.TRACK_WIDTH2);
    }
    instance.endFill();

    //railroad tie
    instance.lineStyle(1, config.RAIL_COLOR);
    for(let i=0; i<config.SUBPIECES; i++) {
      instance.moveTo(fromX + ((i)/config.SUBPIECES)*dX,
        fromY + railEasing((i)/config.SUBPIECES) * (toY - fromY) - config.TRACK_TIE_WIDTH2);
      instance.lineTo(fromX + ((i)/config.SUBPIECES)*dX,
        fromY + railEasing((i)/config.SUBPIECES) * (toY - fromY) + config.TRACK_TIE_WIDTH2);
    }
    instance.endFill();
  }

  var h;
  for(let toRailIndex of railPiece.to) {
    h = toRailIndex - y;
    displayRailPieceSegment(config.PIECE_WIDTH2, config.PIECE_HEIGHT2, config.PIECE_WIDTH, config.PIECE_HEIGHT2 + h * config.PIECE_HEIGHT2, railEasingIn)
  }

  for(let fromRailIndex of railPiece.from) {
    h = fromRailIndex - y;
    displayRailPieceSegment(0, config.PIECE_HEIGHT2 + h * config.PIECE_HEIGHT2, config.PIECE_WIDTH2, config.PIECE_HEIGHT2, railEasingOut)
  }

  if(railPiece.isCart) {
    instance.beginFill(config.EMPTY_CART_COLOR);
    instance.lineStyle();
    instance.drawRect(config.PIECE_WIDTH2 - config.CART_WIDTH2, config.PIECE_HEIGHT2 - config.CART_HEIGHT2, config.CART_WIDTH, config.CART_HEIGHT);
  }
}

const TYPE = "Rail";
export const behavior = {
  customDisplayObject: (props) => {
    const { x, y, railPiece } = props;
    const instance = new PIXI.Graphics();

    instance.x = x * config.PIECE_WIDTH;
    instance.y = y * config.PIECE_HEIGHT;
    instance.width = config.PIECE_WIDTH;
    instance.height = config.PIECE_HEIGHT;

    render(instance, x, y, railPiece);

    return instance;
  },
  customApplyProps: (instance, oldProps, newProps) => {
    const { x, y, railPiece } = newProps;
    render(instance, x, y, railPiece);
  }
};
export default CustomPIXIComponent(behavior, TYPE);
