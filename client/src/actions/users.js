import axios from 'axios';
import {
	REGISTER_SUCCESS,
	UPDATE_ME,
	LOADING_USER,
	TOGGLE_UPDATE_ME,
	GET_ALL_USERS
} from '../actions/types';
import { setAlert, resetAlert } from './alerts';
import catchAsync from '../utils/catchAsync';

export const toggleUpdateMe = edit => dispatch => {
	dispatch(resetAlert());
	dispatch({
		type: TOGGLE_UPDATE_ME,
		payload: !edit
	});
};

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
		dispatch({ type: LOADING_USER, payload: 'load-only' });

		if (file) {
			const uploadConfig = await axios.get('/api/upload');

			await axios.put(uploadConfig.data.url, file, {
				headers: {
					'Content-Type': file.type
				}
			});
			formData.photo = `https://toastmaster-user-photo.s3-ap-southeast-2.amazonaws.com/${uploadConfig.data.key}`;
		}
		const res = await axios.patch('/api/users/updateMe', formData, {
			headers: {
				'Content-Type': 'application/json'
			}
		});

		history.push('/dashboard');
		dispatch({
			type: UPDATE_ME,
			payload: res.data
		});
		dispatch(setAlert('User updated', 'success'));
	});

export const getAllUsers = () =>
	catchAsync(async dispatch => {
		const res = await axios.get('/api/users');

		dispatch({
			type: GET_ALL_USERS,
			payload: res.data
		});
	});
