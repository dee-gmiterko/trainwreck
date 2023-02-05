import React, { useState, useEffect } from "react";
import * as config from "../../config";
import RailwayYard from "../RailwayYard/RailwayYard";
import Train from "../Train/Train";
import KeyListener from "../../game/KeyListener";
import { usePixiTicker } from "react-pixi-fiber";
import { useDispatch, useSelector } from "react-redux";
import { selectRails, selectCursor } from "../../game/railwayYardSlice";
import { selectTrain, selectEnemies, increseControlCounter } from "../../game/trainsSlice";
import { restart, moveTrains, updateCursor, accelerate, decelerate, switchRail } from "../../game/actions";
import { initLeaderboard } from "../../game/leaderboardSlice";

const Trainwreck = () => {
  const dispatch = useDispatch();
  const rails = useSelector(selectRails);
  const cursor = useSelector(selectCursor);
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
      Object.values(keyListeners).forEach(keyListener => {
        keyListener.close();
      })
    }
  }, [])

  useEffect(() => {
    dispatch(restart());
    dispatch(initLeaderboard());
  }, [dispatch])

  usePixiTicker((delta) => {
    // TODO, use delta for realtime physics
    dispatch(moveTrains(delta));
    dispatch(updateCursor());

    if(keyListeners && train) {
      if (!train.isCrashed) {
  			if(keyListeners.up.isDown) {
          if(cursor.x !== undefined && cursor.y !== undefined) {
    				dispatch(switchRail({x: cursor.x, y: cursor.y, value: 0}));
          }
  			}
  			if(keyListeners.down.isDown) {
          if(cursor.x !== undefined && cursor.y !== undefined) {
    				dispatch(switchRail({x: cursor.x, y: cursor.y, value: 1}));
          }
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
        <RailwayYard
          rails={rails}
          switchCursor={cursor}
          switchPath={train && train.path}
        />
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
