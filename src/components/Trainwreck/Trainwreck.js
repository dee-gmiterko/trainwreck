import React, { useState, useEffect, useRef } from "react";
import * as config from "../../config";
import RailwayYard from "../RailwayYard/RailwayYard";
import Train from "../Train/Train";
import Viewport from "../Viewport/Viewport";
import KeyListener from "../../game/KeyListener";
import { usePixiTicker } from "react-pixi-fiber";
import { useDispatch, useSelector } from "react-redux";
import { selectRails } from "../../game/railwayYardSlice";
import { selectTrain, selectEnemies, increseControlCounter } from "../../game/trainsSlice";
import { generateRailwayYard, spawnTrain, moveTrains, accelerate, decelerate, restart } from "../../game/actions";
import { utils } from 'pixi.js';

const Trainwreck = () => {
  const dispatch = useDispatch();
  const rails = useSelector(selectRails);
  const train = useSelector(selectTrain);
  const enemyTrains = useSelector(selectEnemies);
  const [keyListeners, setKeyListeners] = useState();

  useEffect(() => {
    const keyListeners = {
      up: new KeyListener(38),
  		down: new KeyListener(40),
  		left: new KeyListener(37),
  		right: new KeyListener(39),
      space: new KeyListener(32),
    }
    setKeyListeners(keyListeners);
    return () => {
      for(let keyListener of keyListeners) {
        keyListener.close();
      }
    }
  }, [])

  useEffect(() => {
    dispatch(restart());
  }, [])

  usePixiTicker((delta) => {
    // TODO, use delta for realtime physics
    dispatch(moveTrains());

    if(keyListeners && train) {
      if (!train.isCrashed) {
  			if(keyListeners.up.isDown) {
  				// TODO this.switchCursor.switchCursor(0);
  			}
  			if(keyListeners.down.isDown) {
  				// TODO this.switchCursor.switchCursor(1);
  			}
  			if(keyListeners.left.isDown) {
          dispatch(decelerate());
  			}
  			if(keyListeners.right.isDown) {
  				dispatch(accelerate());
  			}
        if(keyListeners.up.isDown || keyListeners.down.isDown || keyListeners.left.isDown || keyListeners.right.isDown) {
          dispatch(increseControlCounter());
        }
      }

      if(keyListeners.space.isDown) {
        if(train.isCrashed) {
          dispatch(restart());
        } else if(config.ALLOW_MIDGAME_RESTART) {
          dispatch(restart());
        }
      }
		}
  })

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
