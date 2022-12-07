import React, { useState, useEffect, useRef } from "react";
import Trainwreck from "../Trainwreck/Trainwreck";
import TrainwreckOverlay from "../TrainwreckOverlay/TrainwreckOverlay";
import Viewport from "../Viewport/Viewport";
import store from "../../game/store";
import { Provider } from "react-redux";
import { Stage } from "react-pixi-fiber";
import { selectGameSize, resize } from "../../game/gameSlice";
import { useDispatch, useSelector } from "react-redux";
import { utils } from 'pixi.js';

const Game = () => {
  const dispatch = useDispatch();
  const {width, height} = useSelector(selectGameSize);

  const resize = () => {
    dispatch(resize({
      width: window.innerWidth,
      height: window.innerHeight,
    }));
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
          <Viewport>
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

const GameWrapper = () => {

  return (
    <Provider store={store}>
      <Game />
      <TrainwreckOverlay />
    </Provider>
  );
};

export default GameWrapper;
