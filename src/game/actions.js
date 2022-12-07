import { createSlice, createSelector } from '@reduxjs/toolkit';
import WorldGenerator from "./WorldGenerator";
import { selectLevel, newLevel, endLevel, selectTransition, decreaseTransition, selectRails, selectRailsWidth, selectIsEmptyCart, removeEmptyCart, selectPath, selectIsSwitchTo, selectCursor, setCursor, setSwitch } from "./railwayYardSlice";
import { addTrain, selectTrains, selectTrain, selectScore, moveCart, addCart, setCarts, trainCrashed, adjustSpeed, selectTrainLocation, updatePath, moveTrainToTransition } from "./trainsSlice";
import { addScore } from "./leaderboardSlice";
import * as config from "../config";

const restart = () => {
  return function (dispatch, getState) {
    const state = getState();
    const level = selectLevel(state);
    dispatch(generateRailwayYard(level+1));
    dispatch(respawnPlayerTrain());
  }
}

const generateRailwayYard = (level) => {
  return function (dispatch, getState) {
    const size = 15 + level*3;
    const levelMaxWidth = 4 + level*2;
    const worldGenerator = new WorldGenerator();
    const rails = worldGenerator.generate(size, levelMaxWidth);
    dispatch(newLevel({
      rails,
      level,
    }));
  }
}

const respawnPlayerTrain = () => {
  return function (dispatch, getState) {
    const state = getState();
    const path = selectPath(state, 0, 0, config.RIGHT);
    dispatch(addTrain({
      clear: true,
      x: -10,
      y: 0,
      path,
    }));
  }
}

const moveTrain = (dispatch, state, trains, trainIndex) => {
  const train = trains[trainIndex];
  const locomotive = train.carts[0];

  var pieceX = Math.floor(locomotive.x / config.PIECE_WIDTH);

  if(!train.isCrashed && pieceX >= selectRailsWidth(state) && trainIndex == 0) {
    dispatch(moveTrainToTransition({
      train: trainIndex,
    }));
    const level = selectLevel(state);
    dispatch(generateRailwayYard(level+1));

  } else if(!train.isCrashed && pieceX < 0 || train.path[pieceX] !== undefined) {

    let newSpeed = train.speed;
    if(train.speed > config.INITIAL_SPEED) {
      newSpeed = train.speed - config.FRICTION;
      dispatch(adjustSpeed({
        train: trainIndex,
        speed: newSpeed,
      }));
    }

    var getY = (x) => {
      if(x < 0) {
        return 0;
      }
      var y1 = config.PIECE_HEIGHT * train.path[Math.floor(x / config.PIECE_WIDTH)];
      var y2 = config.PIECE_HEIGHT * train.path[Math.floor(x / config.PIECE_WIDTH) + 1];
      if(Object.is(y2, NaN)) {
        y2 = y1;
      }
      var t = (x % config.PIECE_WIDTH) / config.PIECE_WIDTH;
      return y1 + t * (y2 - y1);
    }

    var getAngle = (x) => {
      if(x < 0) {
        return 0;
      }
      var y1 = getY(x - config.CART_WIDTH2);
      var y2 = getY(x + config.CART_WIDTH2);
      return Math.atan((y2 - y1) / config.CART_WIDTH);
    }

    //move locomotive
    dispatch(moveCart({
      train: trainIndex,
      cart: 0,
      x: locomotive.x + train.direction * newSpeed,
      y: getY(locomotive.x),
      rotation: getAngle(locomotive.x),
    }));

    //check for cart on rail
    var checkPieceX = Math.round(locomotive.x / config.PIECE_WIDTH);
    var checkPieceY = train.path[checkPieceX];
    const emptyCart = selectIsEmptyCart(state, checkPieceX, checkPieceY);
    if(emptyCart) {
      dispatch(addCart({train: trainIndex}));
      dispatch(removeEmptyCart({x: checkPieceX, y: checkPieceY}));
    }

    //move other carts
    for(let i = 1; i < train.carts.length; i++) {
      let dx = train.carts[i].x - train.carts[i-1].x;
      let dy = train.carts[i].y - train.carts[i-1].y;
      let l = config.CART_DELAY / Math.sqrt(dx * dx + dy * dy);
      dx *= l;
      dy *= l;

      var skew = train.carts[i].y - getY(train.carts[i].x);
      if(Math.abs(skew) > config.CART_MAX_SKEW) {
        skew = Math.sign(skew) * config.CART_MAX_SKEW;
      }

      dispatch(moveCart({
        train: trainIndex,
        cart: i,
        x: train.carts[i-1].x + dx,
        y: train.carts[i-1].y + dy,
        rotation: getAngle(train.carts[i].x),
        skew: skew,
      }))
    }

    //test other train collision
    trains.forEach((otherTrain, otherIndex) => {
      if(otherIndex === trainIndex) {
        return;
      }
      if(otherTrain.isCrashed) {
        return;
      }
      if(otherTrain.isEnemy === train.isEnemy) {
        return;
      }
      otherTrain.carts.forEach(otherCart => {
        var dx = otherCart.x - locomotive.x;
        var dy = otherCart.y - locomotive.y;
        if(Math.sqrt(dx*dx+dy*dy) < (train.isEnemy ? config.TRAIN_CRASH_DISTANCE * 0.81 : config.TRAIN_CRASH_DISTANCE)) {

          let meCarts = train.carts.length - train.carts.length;
          let itCarts = otherTrain.carts.length - train.carts.length;

          let hard = (meCarts < 1 && itCarts >= 1) || (meCarts >= 1 && itCarts < 1);

          if(meCarts < 1) {
            dispatch(setCarts({
              train: trainIndex,
              carts: 1,
            }));
            dispatch(trainCrashed({
              train: trainIndex,
              speed: Math.max(train.speed, otherTrain.speed),
              hard: hard,
              bounce: !hard,
            }));
            const score = selectScore(state);
            if(score > 0) {
              dispatch(addScore({
                score,
              }));
            }

          } else {
            dispatch(setCarts({
              train: trainIndex,
              carts: meCarts,
            }))
          }

          dispatch(setCarts({
            train: otherIndex,
            carts: Math.max(1, itCarts),
          }));
          dispatch(trainCrashed({
            train: otherIndex,
            speed: Math.max(train.speed, otherTrain.speed),
            bounce: true,
          }));
        }
      });
    });
  } else {
    if(!train.isCrashed) {
      dispatch(trainCrashed({
        train: trainIndex,
      }));
      const score = selectScore(state);
      if(score > 0) {
        dispatch(addScore({
          score,
        }));
      }
    }

    const newSpeed = train.speed * config.FRICTION_CRASHED_MOD;
    dispatch(adjustSpeed({
      train: trainIndex,
      speed: newSpeed,
    }));

    //move locomotive
    const newRotation = (locomotive.rotation||0) + Math.min(3, newSpeed) * (Math.random() - 0.5) * 0.2;
    dispatch(moveCart({
      train: trainIndex,
      cart: 0,
      x: locomotive.x + newSpeed * Math.cos(newRotation),
      y: locomotive.y + newSpeed * Math.sin(newRotation),
      rotation: newRotation,
      skew: (locomotive.skew+config.CRASHED_TARGET_SKEW)/2,
    }));

    //move other carts
    for(let i = 1; i < train.carts.length; i++) {
      let dx = train.carts[i].x - train.carts[i-1].x;
      let dy = train.carts[i].y - train.carts[i-1].y;
      let l = config.CART_DELAY / Math.sqrt(dx * dx + dy * dy);
      dx *= l;
      dy *= l;

      dispatch(moveCart({
        train: trainIndex,
        cart: i,
        x: train.carts[i-1].x + dx,
        y: train.carts[i-1].y + dy,
        rotation: Math.min(Math.max(Math.atan(dy / dx), -1), 1),
        skew: (train.carts[i].skew+config.CRASHED_TARGET_SKEW)/2,
      }));
    }
  }
}

const moveTrains = () => {
  return function (dispatch, getState) {
    const state = getState();
    const trains = selectTrains(state);
    for (let trainIndex in trains) {
      moveTrain(dispatch, state, trains, trainIndex)
    }
  }
}

const updateCursor = () => {
  return function (dispatch, getState) {
    const state = getState();
    const train = selectTrain(state);
    if(!train) {
      return;
    }
    const cursor = selectCursor(state);
    const {x: trainX} = selectTrainLocation(state);

    var newCursorX = trainX + train.direction;
    while(
      newCursorX < train.path.length
      && !selectIsSwitchTo(state, newCursorX, train.path[newCursorX])
    ) {
      newCursorX += train.direction;
    }

    if(cursor.x !== newCursorX || cursor.y !== train.path[newCursorX]) {
      dispatch(setCursor({
        x: newCursorX,
        y: train.path[newCursorX],
      }));
    }
  }
}

const spawnEnemies = () => {
  return function (dispatch, getState) {
    const state = getState();
    const train = selectTrain(state);
    const rails = selectRails(state);

    if(Math.random() < config.ENEMY_SPAWN_RATE * train.speed) {
      const x = Math.floor((
        train.carts[0].x + 800 /* TODO dynamic spawn distance */
      ) / config.PIECE_WIDTH);

      if(rails[x]) {
        const ys = Object.keys(rails[x]);
        const y = parseInt(ys[Math.floor(Math.random()*ys.length)], 10);

        const path = selectPath(state, x, y, config.LEFT);
        dispatch(addTrain({
          x, y, path,
          direction: config.LEFT,
          isEnemy: true,
        }));
      }
    }
  }
}

const accelerate = () => {
  return function (dispatch, getState) {
    const state = getState();
    const train = selectTrain(state);
    if(config.MAX_SPEED === undefined || train.speed < config.MAX_SPEED) {
      dispatch(adjustSpeed({
        train: 0,
        speed: train.speed + config.SPEED_CHANGE_BASE * (
          Math.pow(config.SPEED_CHANGE_DROP_PER_CART, train.carts.length)
        ),
      }));
    }
  }
}

const decelerate = () => {
  return function (dispatch, getState) {
    const state = getState();
    const train = selectTrain(state);
    if(config.MIN_SPEED === undefined || train.speed > config.MIN_SPEED) {
      dispatch(adjustSpeed({
        train: 0,
        speed: train.speed - config.SPEED_CHANGE_BASE * (
          Math.pow(config.SPEED_CHANGE_DROP_PER_CART, train.carts.length)
        ),
      }));
    }
  }
}

const switchRail = ({x, y, value}) => {
  return function (dispatch, getState) {
    const state = getState();
    const train = selectTrain(state);

    dispatch(setSwitch({
      x, y,
      side: train.direction == config.RIGHT ? "to" : "from",
      value: value,
    }));

    const newState = getState();
    const trainX = Math.floor(train.carts[0].x / config.PIECE_WIDTH);
    const trainY = train.path[trainX];
    const path = selectPath(newState, trainX, trainY, train.direction);

    const newPath = train.path.slice();
    for(let i=trainX; i<path.length; i++) {
      newPath[i] = path[i];
    }
    dispatch(updatePath({
      train: 0,
      path: newPath,
    }));
  }
}

export {
  restart,
  generateRailwayYard,
  moveTrains,
  updateCursor,
  spawnEnemies,
  accelerate,
  decelerate,
  switchRail,
};
