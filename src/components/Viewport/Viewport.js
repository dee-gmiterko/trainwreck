import React from "react";
import { CustomPIXIComponent, usePixiApp } from "react-pixi-fiber";
import { Viewport } from 'pixi-viewport';
import { useSelector } from "react-redux";
import { selectGameSize, selectCamera } from "../../game/gameSlice";

const TYPE = "Viewport"
const behavior = {
  customDisplayObject: ({ app, width, height }) => {
    const viewport = new Viewport({
        screenWidth: width,
        screenHeight: height,
        interaction: app.renderer.plugins.interaction
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

const CustomViewportWrapper = ({ children }) => {
  const app = usePixiApp();
  const {width, height} = useSelector(selectGameSize);
  const {x, y, zoom} = useSelector(selectCamera);

  return (
    <CustomViewport app={app} width={width} height={height} x={x} y={y} zoom={zoom}>
      {children}
    </CustomViewport>
  );
};

export default CustomViewportWrapper;