import React from "react";
import { CustomPIXIComponent } from "react-pixi-fiber";
import railEasingIn from 'eases/sine-in';
import railEasingOut from 'eases/sine-out';
import * as PIXI from 'pixi.js';
import * as config from"../../config";
import { useSelector } from "react-redux";
import { selectGameSize, selectCamera } from "../../game/gameSlice";
import { selectTrain } from "../../game/trainsSlice";

const render = (instance, width, trainX, zoom, transitionLocked) => {
  instance.clear();

  const displayRailPieceSegment = (fromX, fromY, toX, toY, subpieces, railEasing) => {
    var dX = toX-fromX;

    //top rail
    instance.lineStyle(1, config.RAIL_COLOR);
    for(let i=0; i<subpieces; i++) {
      instance.moveTo(fromX + ((i-1)/subpieces)*dX,
        fromY + railEasing((i-1)/subpieces) * (toY - fromY) - config.TRACK_WIDTH2);
      instance.lineTo(fromX + ((i)/subpieces)*dX,
        fromY + railEasing((i)/subpieces) * (toY - fromY) - config.TRACK_WIDTH2);
    }
    instance.endFill();

    //bottom rail
    instance.lineStyle(1, config.RAIL_COLOR);
    for(let i=0; i<subpieces; i++) {
      instance.moveTo(fromX + ((i-1)/subpieces)*dX,
        fromY + railEasing((i-1)/subpieces) * (toY - fromY) + config.TRACK_WIDTH2);
      instance.lineTo(fromX + ((i)/subpieces)*dX,
        fromY + railEasing((i)/subpieces) * (toY - fromY) + config.TRACK_WIDTH2);
    }
    instance.endFill();

    //railroad tie
    instance.lineStyle(1, config.RAIL_COLOR);
    for(let i=0; i<subpieces; i++) {
      instance.moveTo(fromX + ((i)/subpieces)*dX,
        fromY + railEasing((i)/subpieces) * (toY - fromY) - config.TRACK_TIE_WIDTH2);
      instance.lineTo(fromX + ((i)/subpieces)*dX,
        fromY + railEasing((i)/subpieces) * (toY - fromY) + config.TRACK_TIE_WIDTH2);
    }
    instance.endFill();
  }

  const drawWidth = width/zoom;
  const drawWidth2 = drawWidth/2;
  const subpieces = Math.floor(drawWidth/config.PIECE_WIDTH*config.SUBPIECES);
  const subpieceWidth = drawWidth/subpieces;
  if(transitionLocked) {
    instance.x = (trainX%subpieceWidth);
  } else {
    instance.x = 0;
  }
  displayRailPieceSegment(-drawWidth, config.PIECE_HEIGHT2, -drawWidth2, config.PIECE_HEIGHT2, subpieces, railEasingIn);
  displayRailPieceSegment(-drawWidth2, config.PIECE_HEIGHT2, 0+subpieceWidth, config.PIECE_HEIGHT2, subpieces+1, railEasingOut);
}

const TYPE = "RailTransition";
export const behavior = {
  customDisplayObject: (props) => {
    const { width, trainX, zoom, transitionLocked } = props;
    const instance = new PIXI.Graphics();
    render(instance, width, trainX, zoom, transitionLocked);
    return instance;
  },
  customApplyProps: (instance, oldProps, newProps) => {
    const { width, trainX, zoom, transitionLocked } = newProps;
    render(instance, width, trainX, zoom, transitionLocked);
  }
};

const RailTransition = CustomPIXIComponent(behavior, TYPE);

export default () => {
  const train = useSelector(selectTrain);
  const {width} = useSelector(selectGameSize);
  const {zoom, transitionLocked} = useSelector(selectCamera);

  const trainX = (train && train.carts[0].x) || 0;

  return (
    <RailTransition width={width} trainX={trainX} zoom={zoom} transitionLocked={transitionLocked} />
  )
}
