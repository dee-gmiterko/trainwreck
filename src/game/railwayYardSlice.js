import { createSlice, createSelector } from '@reduxjs/toolkit';

export const railwayYardSlice = createSlice({
  name: 'railwayYard',
  initialState: {
    rails: [],
  },
  reducers: {
    setRails: (state, action) => {
      state.rails = action.payload.rails;
    },
    removeEmptyCart: (state, action) => {
      const {x, y} = action.payload;
      state.rails[x][y].isCart = false;
    }
  },
})

export const {
  setRails,
  removeEmptyCart,
} = railwayYardSlice.actions;

export const selectRails = (state) => state.railwayYard.rails;
export const selectRailPiece = (state, x, y) => {
  const rails = selectRails(state);
  if(rails[x] && rails[x][y]) {
    return rails[x][y];
  }
  return null;
}
export const selectTrackTo = (state, x, y) => {
  const railPiece = selectRailPiece(state, x, y);
  if(railPiece) {
    if(railPiece.isSwitch) {
      return railPiece.to[railPiece.switched.to];
    }
    if(railPiece.to.length > 0) {
      return railPiece.to[0];
    }
  }
  return undefined;
}
export const selectTrackFrom = (state, x, y) => {
  const railPiece = selectRailPiece(state, x, y);
  if(railPiece) {
    if(railPiece.isSwitch) {
      return railPiece.from[railPiece.switched.from];
    }
    if(railPiece.from.length > 0) {
      return railPiece.from[0];
    }
  }
  return undefined;
}
export const selectPath = (state, x, y, direction) => {
  const rails = selectRails(state);
  const path = [];
  path[x] = y;
  while(x < rails.length && x >= 0) {
    var next = (direction === 1) ? (
      selectTrackTo(state, x, y)
    ) : (
      selectTrackFrom(state, x, y)
    );

    if(next === undefined) {
      break; // end of path
    }

    x += direction;

    path[x] = next;
    y = next;
  }
  return path;
}
export const selectIsEmptyCart = (state, x, y) => {
  const railPiece = selectRailPiece(state, x, y);
  return railPiece?.isCart;
}

export default railwayYardSlice.reducer;
