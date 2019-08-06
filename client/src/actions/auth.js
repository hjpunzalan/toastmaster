import { LOGIN_SUCCESS, LOGIN_FAIL } from '../actions/types';

export const loginUser = (formData, history) => dispatch => {
	const user = {
		email: 'hj.punzalan@hotmail.com',
		password: 'friend168'
	};
	if (formData === user) {
		dispatch({
			type: LOGIN_SUCCESS,
			payload: formData
		});
		history.push('/dashboard');
	} else
		dispatch({
			type: LOGIN_FAIL,
			payload: { msg: 'Invalid credentials' }
		});
};
