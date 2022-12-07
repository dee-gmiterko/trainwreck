import { CustomPIXIComponent } from "react-pixi-fiber";
import * as PIXI from 'pixi.js';
import * as config from"../../config";

const render = (instance, path) => {
  instance.clear();

  instance.lineStyle(7, 0xE1303C, 0.5);
  instance.moveTo(0, config.PIECE_HEIGHT2);
  for (var i=0; i < path.length; i++) {
    instance.lineTo(config.PIECE_WIDTH * i + config.PIECE_WIDTH2, config.PIECE_HEIGHT * path[i] + config.PIECE_HEIGHT2);
  }
  instance.endFill();
}

const TYPE = "SwitchPath";
export const behavior = {
  customDisplayObject: (props) => {
    const { path } = props;
    const instance = new PIXI.Graphics();
    render(instance, path);
    return instance;
  },
  customApplyProps: (instance, oldProps, newProps) => {
    const { path } = newProps;
    render(instance, path);
  }
};
export default CustomPIXIComponent(behavior, TYPE);
