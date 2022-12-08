import { createSlice, createSelector } from '@reduxjs/toolkit';
import * as config from "../config";

export const trainsSlice = createSlice({
  name: 'trains',
  initialState: {
    trains: [],
    controlCounter: 0,
    score: 0,
  },
  reducers: {
    addTrain: (state, action) => {
      const { clear, direction, speed, isEnemy, x, y, path } = action.payload;
      if(clear) {
        state.trains = [];
        state.score = 0;
      }
      state.trains.push({
        direction: direction || config.RIGHT,
        speed: speed || config.INITIAL_SPEED,
        isCrashed: false,
        isEnemy: isEnemy || false,
        carts: [
          {
            x: (x || 0) * config.PIECE_WIDTH + config.PIECE_WIDTH2 * (direction || config.RIGHT),
        		y: (y || 0) * config.PIECE_HEIGHT,
            rotation: 0,
          }
        ],
        path: path,
      })
    },
    updatePath: (state, action) => {
      const {train, path} = action.payload;
      state.trains[train].path = path;
    },
    addCart: (state, action) => {
      const {train} = action.payload;
      const carts = state.trains[train].carts;
      carts.push({
        x: -999999 * state.trains[train].direction,
        y: 0,
        rotation: 0,
      })
      if(train == 0) {
        state.score++;
      }
    },
    removeCart: (state, action) => {
      const {train} = action.payload;
      const carts = state.trains[train].carts;
      carts.splice(carts.length-1, 1);
    },
    setCarts: (state, action) => {
      const {train, carts} = action.payload;
      const trainCarts = state.trains[train].carts;
      if (trainCarts.length > carts) {
        trainCarts.splice(trainCarts.length-1, 1);
      } else {
        for (let i=0; i<carts-trainCarts.length; i++) {
          trainCarts.push({
            x: -999999 * state.trains[train].direction,
            y: 0,
            rotation: 0,
          })
        }
      }
    },
    moveCart: (state, action) => {
      const {train, cart, x, y, rotation, skew} = action.payload;
      state.trains[train].carts[cart] = {
        x, y, rotation,
        skew: skew || 0,
      };
    },
    trainCrashed: (state, action) => {
      const {train, speed, hard, bounce} = action.payload;
      state.trains[train].isCrashed = true;
      if (speed) {
        state.trains[train].speed = speed;
      }
      if (hard && speed) {
        state.trains[train].carts[0].rotation += Math.min(1, speed) * Math.PI / 4;
      }
      if (bounce) {
        state.trains[train].speed *= -0.6;
      }
    },
    moveTrainToTransition: (state, action) => {
      const {train} = action.payload;
      const carts = state.trains[train].carts;
      const newX = -20 * config.PIECE_WIDTH;
      const newXs = carts.map(cart => newX+cart.x-carts[0].x);
      for(let i=0; i<carts.length; i++) {
        carts[i].x = newXs[i];
      }
      // remove enemies
      state.trains = [state.trains[0]];
    },
    adjustSpeed: (state, action) => {
      const {train, speed} = action.payload;
      state.trains[train].speed = speed;
    },
    increseControlCounter: (state, action) => {
      state.controlCounter += 1;
    }
  },
})

export const {
  addTrain,
  updatePath,
  addCart,
  removeCart,
  setCarts,
  moveCart,
  trainCrashed,
  moveTrainToTransition,
  adjustSpeed,
  increseControlCounter,
} = trainsSlice.actions;

export const selectTrains = (state) => state.trains.trains;
export const selectControlCounter = (state) => state.trains.controlCounter;
export const selectScore = (state) => state.trains.score;
export const selectTrain = (state) => selectTrains(state)[0];
export const selectEnemies = (state) => selectTrains(state).slice(1);
export const selectCartsCount = (state) => (selectTrain(state)?.carts.length - 1) || 0;
export const selectTrainLocation = (state) => {
  const train = selectTrain(state);
  return train && {
    x: parseInt(train.carts[0].x / config.PIECE_WIDTH),
    y: parseInt(train.carts[0].y / config.PIECE_HEIGHT),
  }
}
export const selectSpeed = (state) => selectTrain(state)?.speed;
export const selectCrashed = (state) => selectTrain(state)?.isCrashed;
export const selectGuideVisibility = (state) => Math.max(0, 100-selectControlCounter(state)) / 100;
export default trainsSlice.reducer;
