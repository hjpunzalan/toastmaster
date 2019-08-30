import axios from 'axios';
import { LOGIN_SUCCESS } from '../actions/types';
import catchAsync from '../hooks/catchAsync';
import { resetAlert } from './alerts';

export const loginUser = (formData, history) =>
	catchAsync('login', async dispatch => {
		dispatch(resetAlert()); //Need to be in every action with alert
		const res = await axios.post('/api/auth/login', formData);
		dispatch({
			type: LOGIN_SUCCESS,
			payload: res.data
		});
		history.push('/dashboard');
	});

export const checkUser = () =>
	catchAsync('auth', async dispatch => {
		const res = await axios.get('/api/auth/checkUser');
		const user = res.data;
		dispatch({
			type: LOGIN_SUCCESS,
			payload: user
		});
	});
