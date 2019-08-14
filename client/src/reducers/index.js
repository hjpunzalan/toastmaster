import { combineReducers } from 'redux';
import users from './users';
import auth from './auth';
import alerts from './alerts';
import post from './post';
import textEditor from './textEditor';

export default combineReducers({ users, auth, alerts, post, textEditor });
