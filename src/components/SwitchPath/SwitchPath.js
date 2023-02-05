import { CustomPIXIComponent } from "react-pixi-fiber";
import * as PIXI from 'pixi.js';
import * as config from"../../config";

const render = (instance, path, rails) => {
  instance.clear();

  instance.lineStyle(7, 0xE1303C, 0.5);
  instance.moveTo(0, config.PIECE_HEIGHT2);
  for (var i=0; i<path.length; i++) {
    if(
      (rails[i-1] && Object.keys(rails[i-1]).length > 1) ||
      (rails[i] && Object.keys(rails[i]).length > 1)
    ) {
      instance.lineTo(config.PIECE_WIDTH * i + config.PIECE_WIDTH2, config.PIECE_HEIGHT * path[i] + config.PIECE_HEIGHT2);
    } else {
      instance.moveTo(config.PIECE_WIDTH * i + config.PIECE_WIDTH2, config.PIECE_HEIGHT * path[i] + config.PIECE_HEIGHT2);
    }
  }
  instance.endFill();
}

const TYPE = "SwitchPath";
export const behavior = {
  customDisplayObject: (props) => {
    const { path, rails } = props;
    const instance = new PIXI.Graphics();
    render(instance, path, rails);
    return instance;
  },
  customApplyProps: (instance, oldProps, newProps) => {
    const { path, rails } = newProps;
    render(instance, path, rails);
  }
};
export default CustomPIXIComponent(behavior, TYPE);
