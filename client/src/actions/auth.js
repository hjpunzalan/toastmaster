import { LOGIN_SUCCESS, LOGIN_FAIL } from '../actions/types';
import { setAlert, resetAlert } from './alerts';

export const loginUser = (formData, history) => dispatch => {
	dispatch(resetAlert()); //Need to be in every action
	const user = {
		email: 'hj.punzalan@hotmail.com',
		password: 'test123'
	};
	if (formData.email === user.email && formData.password === user.password) {
		dispatch({
			type: LOGIN_SUCCESS,
			payload: formData
		});
		history.push('/dashboard');
	} else {
		const msg = 'Invalid email or password';
		dispatch({
			type: LOGIN_FAIL,
			payload: { msg }
		});
		dispatch(setAlert(msg, 'fail'));
	}
};
