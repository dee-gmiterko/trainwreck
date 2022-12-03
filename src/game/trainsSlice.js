import { createSlice, createSelector } from '@reduxjs/toolkit';
import { selectPath } from "./railwayYardSlice";
import * as config from "../config";

export const trainsSlice = createSlice({
  name: 'trains',
  initialState: {
    trains: [],
  },
  reducers: {
    addTrain: (state, action) => {
      const vals = action.payload;
      state.trains.push({
        direction: vals.direction || config.RIGHT,
        speed: vals.speed || config.INITIAL_SPEED,
        isCrashed: false,
        isEnemy: vals.isEnemy || false,
        carts: [
          {
            x: (vals.x || 0) * config.PIECE_WIDTH + config.PIECE_WIDTH2 * (vals.direction || config.RIGHT),
        		y: (vals.y || 0) * config.PIECE_HEIGHT,
            rotation: 0,
          }
        ],
        path: vals.path,
      })
    },
    addCart: (state, action) => {
      const {train} = action.payload;
      const carts = state.trains[train].carts;
      carts.push({
        x: -999999 * state.trains[train].direction,
        y: 0,
        rotation: 0,
      })
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
      if (hard) {
        state.trains[train].carts[0].rotation += Math.min(1, speed) * Math.PI / 4;
      }
      if (bounce) {
        state.trains[train].speed *= -1;
      }
    },
    adjustSpeed: (state, action) => {
      const {train, speed} = action.payload;
      state.trains[train].speed = speed;
    }
  },
})

export const {
  addTrain,
  addCart,
  removeCart,
  setCarts,
  moveCart,
  trainCrashed,
  adjustSpeed,
} = trainsSlice.actions;

export const selectTrains = (state) => state.trains.trains;
export const selectTrain = (state) => selectTrains(state)[0];
export const selectEnemies = (state) => selectTrains(state).slice(1);

export default trainsSlice.reducer;
