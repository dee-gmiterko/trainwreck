import { combineReducers } from 'redux';

import railwayYardReducer from "./railwayYardSlice";
import trainsReducer from './trainsSlice';

const rootReducer = combineReducers({
  railwayYard: railwayYardReducer,
  trains: trainsReducer,
});

export default rootReducer;
