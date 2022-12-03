import React, { useState, useEffect, useRef } from "react";
import Trainwreck from "../Trainwreck/Trainwreck";
import TrainwreckOverlay from "../TrainwreckOverlay/TrainwreckOverlay";
import Viewport from "../Viewport/Viewport";
import { Stage } from "react-pixi-fiber";
import { utils } from 'pixi.js';
import store from "../../game/store";
import { Provider } from "react-redux";

const Game = () => {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  const resize = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  }

  useEffect(() => {
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
    }
  }, [])

  return (
    <>
      <Stage options={{
        backgroundColor: utils.string2hex("white"),
        width: width,
        height: height,
        antialias: true,
        autoDensity: true,
        resolution: 2,
      }}>
        <Provider store={store}>
          <Viewport width={width} height={height}>
            <Trainwreck />
          </Viewport>
        </Provider>
      </Stage>
      <Provider store={store}>
        <TrainwreckOverlay />
      </Provider>
    </>
  );
};

export default Game;
