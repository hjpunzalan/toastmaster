import axios from 'axios';
import { REGISTER_SUCCESS, UPDATE_ME } from '../actions/types';
import { setAlert, resetAlert } from './alerts';
import catchAsync from '../utils/catchAsync';

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

export const updateMe = (formData, file, history) =>
	catchAsync('auth', async dispatch => {
		dispatch(resetAlert());

		const uploadConfig = await axios.get('/api/upload');

		const image = await axios.put(uploadConfig.data.url, file, {
			headers: {
				'Content-Type': 'file.type'
			}
		});

		console.log(image);

		const res = await axios.patch(
			'/api/users/updateMe',
			{ ...formData },
			{
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);

		dispatch({
			type: UPDATE_ME,
			payload: res.data
		});
		history.push('/discussion');
	});
