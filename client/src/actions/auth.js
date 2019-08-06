import { LOGIN_SUCCESS, LOGIN_FAIL } from '../actions/types';
import { setAlert } from './alerts';

export const loginUser = (formData, history) => dispatch => {
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
		dispatch(setAlert('Invalid credentials', 'fail'));

		dispatch({
			type: LOGIN_FAIL,
			payload: { msg: 'Invalid credentials' }
		});
	}
};
