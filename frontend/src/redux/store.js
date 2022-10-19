import { createStore, combineReducers } from 'redux';
import userReducer from './reducers/user';
import votesReducer from './reducers/votes';

export default createStore(combineReducers({ user: userReducer, votes: votesReducer }));
