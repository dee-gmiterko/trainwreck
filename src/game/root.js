import { combineReducers } from 'redux';

import railwayYardReducer from "./railwayYardSlice";
import trainsReducer from './trainsSlice';
import leaderboardReducer from "./leaderboardSlice";

const rootReducer = combineReducers({
  railwayYard: railwayYardReducer,
  trains: trainsReducer,
  leaderboard: leaderboardReducer,
});

export default rootReducer;
