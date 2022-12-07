import { combineReducers } from 'redux';

import gameReducer from "./gameSlice";
import railwayYardReducer from "./railwayYardSlice";
import trainsReducer from './trainsSlice';
import leaderboardReducer from "./leaderboardSlice";

const rootReducer = combineReducers({
  game: gameReducer,
  railwayYard: railwayYardReducer,
  trains: trainsReducer,
  leaderboard: leaderboardReducer,
});

export default rootReducer;
