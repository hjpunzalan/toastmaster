import { LOGIN_SUCCESS, LOGIN_FAIL } from '../actions/types';
import axios from 'axios';
import { setAlert, resetAlert } from './alerts';

export const loginUser = (formData, history) => async dispatch => {
	try {
		dispatch(resetAlert()); //Need to be in every action with alert
		const res = await axios.post('/api/auth/login', formData);
		dispatch({
			type: LOGIN_SUCCESS,
			payload: res.data
		});
		history.push('/dashboard');
	} catch (err) {
		const errors = err.response.data;
		dispatch({
			type: LOGIN_FAIL,
			payload: errors.message
		});
		dispatch(setAlert(errors.message, 'fail'));
	}
};
