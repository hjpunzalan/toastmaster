import { combineReducers } from 'redux';
import users from './users';
import auth from './auth';
import alerts from './alerts';

export default combineReducers({ users, auth, alerts });
