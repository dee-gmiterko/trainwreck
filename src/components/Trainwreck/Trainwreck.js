import React, { useState, useEffect, useRef } from "react";
import * as config from "../../config";
import RailwayYard from "../RailwayYard/RailwayYard";
import Train from "../Train/Train";
import Viewport from "../Viewport/Viewport";
import KeyListener from "../../game/KeyListener";
import { usePixiTicker } from "react-pixi-fiber";
import { selectRails } from "../../game/railwayYardSlice";
import { selectTrain, selectEnemies } from "../../game/trainsSlice";
import { useDispatch, useSelector } from "react-redux";
import { generateRailwayYard, spawnTrain, moveTrains, accelerate, decelerate } from "../../game/actions";
import { utils } from 'pixi.js';

const Trainwreck = () => {
  const dispatch = useDispatch();
  const rails = useSelector(selectRails);
  const train = useSelector(selectTrain);
  const enemyTrains = useSelector(selectEnemies);
  const [keyListeners, setKeyListeners] = useState();

  useEffect(() => {
    dispatch(generateRailwayYard(40));
    dispatch(spawnTrain({x: 0, y:0}))
  }, [])

  usePixiTicker((delta) => {
    // TODO, use delta for realtime physics
    dispatch(moveTrains());
    
    if(keyListeners && train && !train.isCrashed) {
			if(keyListeners.up.isDown) {
				this.switchCursor.switchCursor(0);
			}
			if(keyListeners.down.isDown) {
				this.switchCursor.switchCursor(1);
			}
			if(keyListeners.left.isDown) {
        dispatch(decelerate());
			}
			if(keyListeners.right.isDown) {
				dispatch(accelerate());
			}
		}
  })

  useEffect(() => {
    const keyListeners = {
      up: new KeyListener(38),
  		down: new KeyListener(40),
  		left: new KeyListener(37),
  		right: new KeyListener(39),
    }
    setKeyListeners(keyListeners);
    return () => {
      for(let keyListener of keyListeners) {
        keyListener.close();
      }
    }
  }, [])

  return (
    <>
      {rails && (
        <RailwayYard rails={rails} />
      )}
      {train && (
        <Train train={train} />
      )}
      {enemyTrains.map((enemyTrain, index) => (
        <Train key={index} train={enemyTrain} />
      ))}
    </>
  )
};

export default Trainwreck;
