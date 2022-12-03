import React from "react";
import { CustomPIXIComponent, usePixiApp } from "react-pixi-fiber";
import { Viewport } from 'pixi-viewport';
import { useSelector } from "react-redux";
import { selectTrain } from "../../game/trainsSlice";
import * as config from "../../config";

const TYPE = "Viewport"
const behavior = {
  customDisplayObject: ({ app, width, height }) => {
    const viewport = new Viewport({
        screenWidth: width,
        screenHeight: height,
        interaction: app.renderer.plugins.interaction
    });

    viewport
      .wheel()
      .clampZoom({
        minScale: 0.1,
        maxScale: 5,
      });

    return viewport;
  },
  customApplyProps: function(viewport, oldProps, newProps) {
    const { width, height, x, y, zoom } = newProps;

    viewport.screenWidth = width;
    viewport.screenHeight = height;

    if (x !== undefined && y !== undefined && zoom !== undefined) {
      viewport.setZoom(zoom);
      viewport.moveCenter(x, y);
    }
  }
}

const CustomViewport = CustomPIXIComponent(behavior, TYPE);

export default ({width, height, children}) => {
  const app = usePixiApp();
  const train = useSelector(selectTrain);

  let x, y, zoom;
  if(train) {
    zoom = 1 / (config.MIN_ZOOM + Math.atan(train.speed / 30) * config.MAX_ZOOM);
    x = train.carts[0].x + config.CAMERA_CENTER_PERC * width / zoom;
    y = train.carts[0].y;
  }

  return (
    <CustomViewport app={app} width={width} height={height} x={x} y={y} zoom={zoom}>
      {children}
    </CustomViewport>
  );
};
