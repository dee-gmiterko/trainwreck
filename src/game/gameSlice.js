import { createSlice, createSelector } from '@reduxjs/toolkit';
import { randomName } from "../utils";
import { selectTrain } from "./trainsSlice";
import * as config from "../config";

export const gameSlice = createSlice({
  name: 'game',
  initialState: {
    width: window.innerWidth,
    height: window.innerHeight,
  },
  reducers: {
    resize: (state, action) => {
      const { width, height } = action.payload;
      state.width = width;
      state.height = height;
    },
  },
})

export const {
  resize,
} = gameSlice.actions;

export const selectGameSize = (state) => (
  {
    width: state.game.width,
    height: state.game.height,
  }
);
export const selectCamera = (state) => {
  let x, y, zoom, transitionLocked;
  const {width} = selectGameSize(state);
  const train = selectTrain(state);
  if(train) {
    zoom = 1 / (config.MIN_ZOOM + Math.atan(train.speed / 30) * config.MAX_ZOOM);
    x = train.carts[0].x + (config.CAMERA_CENTER_PERC * width / zoom);
    const minX = ((width/zoom)/-2);
    if(x < minX) {
      x = minX;
      transitionLocked = true;
    }
    const bob = Math.pow(Math.sin(x*Math.PI/config.VIEW_BOB_SPACING), 62) * config.VIEW_BOB_SIZE * Math.min(1, Math.sqrt(Math.max(0, train.speed))) / zoom;
    y = train.carts[0].y - bob;
  }

  return {x, y, zoom, transitionLocked};
}


export default gameSlice.reducer;
