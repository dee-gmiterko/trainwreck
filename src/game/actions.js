import WorldGenerator from "./WorldGenerator";
import { selectCameraBox } from "./gameSlice";
import { selectLevel, newLevel, selectRails, selectRailsWidth, selectIsEmptyCart, removeEmptyCart, selectPath, selectIsSwitchTo, selectCursor, setCursor, setSwitch } from "./railwayYardSlice";
import { addTrain, selectTrains, selectTrain, selectScore, moveCart, addCart, setCarts, trainCrashed, adjustSpeed, selectTrainLocation, updatePath, moveTrainToTransition } from "./trainsSlice";
import { addScore } from "./leaderboardSlice";
import * as config from "../config";

const restart = () => {
  return function (dispatch) {
    dispatch(generateRailwayYard(1));
    dispatch(respawnPlayerTrain());
  }
}

const generateRailwayYard = (level) => {
  return function (dispatch, getState) {
    const size = config.LEVEL_SIZE + level * config.LEVEL_SIZE_INCREASE;
    const levelMaxWidth = config.LEVEL_WIDTH + level * config.LEVEL_WIDTH_INCREASE;
    const worldGenerator = new WorldGenerator();
    const rails = worldGenerator.generate(size, levelMaxWidth);
    dispatch(newLevel({
      rails,
      level,
    }));
    setTimeout(() => {
      dispatch(spawnEnemies(level));
      dispatch(updatePath({
        train: 0,
        path: selectPath(getState(), 0, 0, config.RIGHT)
      }));
    })
  }
}

const respawnPlayerTrain = () => {
  return function (dispatch, getState) {
    const state = getState();
    const path = selectPath(state, 0, 0, config.RIGHT);
    dispatch(addTrain({
      clear: true,
      x: -5,
      y: 0,
      path,
    }));
  }
}

const moveTrain = (dispatch, state, delta, trains, trainIndex, alreadyColided) => {
  const train = trains[trainIndex];
  const locomotive = train.carts[0];

  var pieceX = Math.floor(locomotive.x / config.PIECE_WIDTH);

  if(!train.isCrashed && pieceX >= selectRailsWidth(state) && trainIndex === 0) {
    dispatch(moveTrainToTransition({
      train: trainIndex,
    }));
    const level = selectLevel(state);
    dispatch(generateRailwayYard(level+1));
    return true;

  } else if(!train.isCrashed && (pieceX < 0 || train.path[pieceX] !== undefined)) {

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
    const newCarts = train.carts.map(c => ({x: c.x, y: c.y}));
    newCarts[0].x = locomotive.x + train.direction * newSpeed * delta;
    newCarts[0].y = getY(newCarts[0].x);
    dispatch(moveCart({
      train: trainIndex,
      cart: 0,
      x: newCarts[0].x,
      y: newCarts[0].y,
      rotation: getAngle(newCarts[0].x),
    }));

    //check for cart on rail
    var checkPieceX = Math.round(newCarts[0].x / config.PIECE_WIDTH);
    var checkPieceY = train.path[checkPieceX];
    const emptyCart = selectIsEmptyCart(state, checkPieceX, checkPieceY);
    if(emptyCart) {
      dispatch(addCart({train: trainIndex}));
      dispatch(removeEmptyCart({x: checkPieceX, y: checkPieceY}));
    }

    //move other carts
    for(let i = 1; i < newCarts.length; i++) {
      let dx = newCarts[i].x - newCarts[i-1].x;
      let dy = newCarts[i].y - newCarts[i-1].y;
      let l = config.CART_DELAY / Math.sqrt(dx * dx + dy * dy);
      dx *= l;
      dy *= l;

      var skew = train.carts[i].y - getY(newCarts[i].x);
      if(Math.abs(skew) > config.CART_MAX_SKEW) {
        skew = Math.sign(skew) * config.CART_MAX_SKEW;
      }

      newCarts[i].x = newCarts[i-1].x + dx;
      newCarts[i].y = newCarts[i-1].y + dy;

      dispatch(moveCart({
        train: trainIndex,
        cart: i,
        x: newCarts[i].x,
        y: newCarts[i].y,
        rotation: getAngle(newCarts[i].x),
        skew: skew,
      }))
    }

    //test other train collision
    for (let otherIndex = 0; otherIndex < trains.length; otherIndex++) {
      const otherTrain = trains[otherIndex];
      if(otherIndex === trainIndex) {
        continue;
      }
      if(otherTrain.isCrashed) {
        continue;
      }
      if(alreadyColided.includes(otherIndex) || alreadyColided.includes(trainIndex)) {
        continue;
      }
      for (let otherCartIndex = 0; otherCartIndex < otherTrain.carts.length; otherCartIndex++) {
        const otherCart = otherTrain.carts[otherCartIndex];

        var dx = otherCart.x - locomotive.x;
        var dy = otherCart.y - locomotive.y;
        if(Math.sqrt(dx*dx+dy*dy) < (train.isEnemy ? config.TRAIN_CRASH_DISTANCE * 0.81 : config.TRAIN_CRASH_DISTANCE)) {

          let meCarts = train.carts.length - otherTrain.carts.length;
          let itCarts = otherTrain.carts.length - train.carts.length;

          let hard = (meCarts < 1 && itCarts >= 1) || (meCarts >= 1 && itCarts < 1);

          dispatch(setCarts({
            train: trainIndex,
            carts: Math.max(1, meCarts),
          }));
          if(meCarts < 1) {
            if(trainIndex === 0) {
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
              break;
            } else {
              dispatch(trainCrashed({
                train: trainIndex,
                speed: Math.max(train.speed, otherTrain.speed),
                bounce: true,
              }));
              break;
            }
          }

          dispatch(setCarts({
            train: otherIndex,
            carts: Math.max(1, itCarts),
          }));
          if(itCarts < 1) {
            if(otherIndex === 0) {
              dispatch(trainCrashed({
                train: otherIndex,
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
              break;
            } else {
              dispatch(trainCrashed({
                train: otherIndex,
                speed: Math.max(train.speed, otherTrain.speed),
                bounce: true,
              }));
              break;
            }
          }

          alreadyColided.push(trainIndex)
          alreadyColided.push(otherIndex);
        }
      }
    }
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
    const newCarts = train.carts.map(c => ({x: c.x, y: c.y}));
    const newRotation = (locomotive.rotation||0) + Math.min(3, newSpeed) * (Math.random() - 0.5) * 0.2 * delta;
    newCarts[0].x = locomotive.x + newSpeed * Math.cos(newRotation) * delta;
    newCarts[0].y = locomotive.y + newSpeed * Math.sin(newRotation) * delta;
    dispatch(moveCart({
      train: trainIndex,
      cart: 0,
      x: newCarts[0].x,
      y: newCarts[0].y,
      rotation: newRotation,
      skew: (locomotive.skew+config.CRASHED_TARGET_SKEW)/2,
    }));

    //move other carts
    for(let i = 1; i < newCarts.length; i++) {
      let dx = newCarts[i].x - newCarts[i-1].x;
      let dy = newCarts[i].y - newCarts[i-1].y;
      let l = config.CART_DELAY / Math.sqrt(dx * dx + dy * dy);
      dx *= l;
      dy *= l;

      newCarts[i].x = newCarts[i-1].x + dx;
      newCarts[i].y = newCarts[i-1].y + dy;

      dispatch(moveCart({
        train: trainIndex,
        cart: i,
        x: newCarts[i].x,
        y: newCarts[i].y,
        rotation: Math.min(Math.max(Math.atan(dy / dx), -1), 1),
        skew: (train.carts[i].skew+config.CRASHED_TARGET_SKEW)/2,
      }));
    }
  }
}

const moveTrains = (delta) => {
  return function (dispatch, getState) {
    const state = getState();
    const trains = selectTrains(state);
    const cameraBox = selectCameraBox(state);
    const alreadyColided = [];
    for (let trainIndex = 0; trainIndex < trains.length; trainIndex++) {
      const trainX = trains[trainIndex].carts[0].x;
      if(trainIndex === 0 || (trainX >= cameraBox.x && trainX < cameraBox.x+cameraBox.width)) {
        const levelFinished = moveTrain(dispatch, state, delta, trains, trainIndex, alreadyColided);
        if (levelFinished) {
          break;
        }
      }
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

const spawnEnemies = (level) => {
  return function (dispatch, getState) {
    const state = getState();
    const rails = selectRails(state);
    const rate = config.ENEMY_SPAWN_RATE + level * config.ENEMY_SPAWN_RATE_INCREASE;
    for (let xstr in rails) {
      const x = parseInt(xstr);
      if (Object.keys(rails[xstr]).length > 1) {
        for (let ystr in rails[xstr]) {
          const y = parseInt(ystr);
          if(Math.random() < rate) {
            const path = selectPath(state, x, y, config.LEFT);
            let carts = 0;
            while (carts < 5 && Math.random() < config.ENEMY_SPAWN_CARTS_PROB) {
              carts++;
            }
            dispatch(addTrain({
              x, y, path,
              direction: config.LEFT,
              isEnemy: true,
              carts,
            }));
          }
        }
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
      side: train.direction === config.RIGHT ? "to" : "from",
      value: value,
    }));

    const newState = getState();
    const trainX = Math.max(0, Math.floor(train.carts[0].x / config.PIECE_WIDTH));
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
