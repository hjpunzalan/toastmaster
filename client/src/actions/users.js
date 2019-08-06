import { REGISTER_SUCCESS } from '../actions/types';
import { setAlert, resetAlert } from './alerts';

export const registerUser = formData => dispatch => {
	dispatch(resetAlert());
	const users = [
		{
			firstName: 'Jonathan',
			lastName: 'Punzalan',
			email: 'hj.punzalan@hotmail.com'
		}
	];

	const checkUsers = users.filter(user => user.email === formData.email);

	if (checkUsers.length === 0)
		dispatch({
			type: REGISTER_SUCCESS,
			payload: formData
		});
	else dispatch(setAlert('Email already taken', 'fail'));
};
