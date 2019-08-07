import { REGISTER_SUCCESS } from '../actions/types';
import { setAlert, resetAlert } from './alerts';

export const registerUser = formData => dispatch => {
	const { firstName, lastName, email } = formData;
	dispatch(resetAlert());
	let users = JSON.parse(localStorage.getItem('users')) || [
		{
			firstName: 'Jonathan',
			lastName: 'Punzalan',
			email: 'hj.punzalan@hotmail.com'
		}
	];

	const checkUsers = users.filter(user => user.email === email);

	if (checkUsers.length === 0) {
		users.push(formData);

		dispatch({
			type: REGISTER_SUCCESS,
			payload: users
		});

		dispatch(
			setAlert(`${firstName} ${lastName} succesfully registered.`, 'success')
		);
	} else
		dispatch(setAlert(`Email: ${email} has already been registered`, 'fail'));
};
