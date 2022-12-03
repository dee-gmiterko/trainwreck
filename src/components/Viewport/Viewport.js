import React from "react";
import { CustomPIXIComponent, usePixiApp } from "react-pixi-fiber";
import { Viewport } from 'pixi-viewport';

const TYPE = "Viewport"
const behavior = {
  customDisplayObject: ({ app }) => {
    const viewport = new Viewport({
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        interaction: app.renderer.plugins.interaction
    });

    viewport
      .drag()
      .wheel()
      .decelerate({
        friction: 0.92
      })
      .clampZoom({
        minScale: 0.1,
        maxScale: 5,
      });

    return viewport;
  },
  customApplyProps: function(viewport, oldProps, newProps) {
    const { width, height } = newProps;
    viewport.screenWidth = width;
    viewport.screenHeight = height;
  }
}

const CustomViewport = CustomPIXIComponent(behavior, TYPE);

export default React.forwardRef(({width, height, mapWidth, mapHeight, children}, ref) => {
  const app = usePixiApp();
  return (
    <CustomViewport app={app} width={width} height={height} mapWidth={mapWidth} mapHeight={mapHeight} ref={ref}>
      {children}
    </CustomViewport>
  );
})
