import { CustomPIXIComponent } from "react-pixi-fiber";
import * as PIXI from 'pixi.js';
import * as config from"../../config";

const TYPE = "SwitchCursor";
export const behavior = {
  customDisplayObject: (props) => {
    const { x, y } = props;

    const instance = new PIXI.Graphics();
    instance.width = config.CURSOR_SIZE;
    instance.height = config.CURSOR_SIZE;
    instance.x = x * config.PIECE_WIDTH + config.PIECE_WIDTH2;
    instance.y = y * config.PIECE_HEIGHT + config.PIECE_HEIGHT2;

    instance.lineStyle(config.CURSOR_WIDTH, config.CURSOR_COLOR);
    instance.drawEllipse(0, 0, config.CURSOR_SIZE, config.CURSOR_SIZE);
    for (var i=0; i < 4; i++) {
      var lx = Math.cos(i / 2 * Math.PI + Math.PI/4);
      var ly = Math.sin(i / 2 * Math.PI + Math.PI/4);
      instance.moveTo(lx * config.CURSOR_SIZE * 0.5, ly * config.CURSOR_SIZE * 0.5);
      instance.lineTo(lx * config.CURSOR_SIZE * 1.3, ly * config.CURSOR_SIZE * 1.3);
    }
    instance.endFill();

    return instance;
  },
  customApplyProps: (instance, oldProps, newProps) => {
    const { x, y } = newProps;
    instance.x = x * config.PIECE_WIDTH + config.PIECE_WIDTH2 + 20;
    instance.y = y * config.PIECE_HEIGHT + config.PIECE_HEIGHT2;
  }
};
export default CustomPIXIComponent(behavior, TYPE);
