import axios from 'axios';
import {
	LOGIN_SUCCESS,
	CLEAR_LOGIN,
	LOGOUT,
	AUTH_ERROR,
	FORGOT_PASSWORD,
	LOADING_AUTH,
	RESET_PASSWORD,
	CHANGE_PASSWORD
} from '../actions/types';
import catchAsync from '../utils/catchAsync';
import { resetAlert, setAlert } from './alerts';

export const loginUser = (formData, history) =>
	catchAsync('auth', async dispatch => {
		dispatch(resetAlert()); //Need to be in every action with alert
		dispatch({ type: CLEAR_LOGIN });
		const res = await axios.post('/api/auth/login', formData);
		dispatch({
			type: LOGIN_SUCCESS,
			payload: res.data
		});
		history.push('/dashboard');
	});

export const checkUser = () => async dispatch => {
	try {
		const res = await axios.get('/api/auth/checkUser');
		const user = res.data;
		dispatch({
			type: LOGIN_SUCCESS,
			payload: user
		});
	} catch (error) {
		dispatch({ type: AUTH_ERROR });
	}
};

export const logoutUser = () =>
	catchAsync('auth', async dispatch => {
		dispatch({ type: CLEAR_LOGIN });
		await axios.get('/api/auth/logout');
		dispatch({ type: LOGOUT });
		dispatch(setAlert('User successfully logged out', 'success'));
	});

export const forgotPassword = (email, url) =>
	catchAsync('auth', async dispatch => {
		dispatch(resetAlert());
		dispatch({ type: LOADING_AUTH });
		// Send info to server that will send email.
		await axios.post(
			'/api/auth/forgotPassword',
			{ email, url },
			{
				headers: {
					'Content-type': 'application/json'
				}
			}
		);
		dispatch({ type: FORGOT_PASSWORD });
		dispatch(
			setAlert(
				'Success! Please check your email to reset your password.',
				'success'
			)
		);
	});

export const resetPassword = ({ password: newPassword }, token, history) =>
	catchAsync('auth', async dispatch => {
		dispatch(resetAlert());
		dispatch({ type: LOADING_AUTH }); // need to load when we sumbmit a post or patch request

		// Send info to server that will send email.
		const res = await axios.patch(
			`/api/auth/resetPassword/${token}`,
			{ password: newPassword },
			{
				headers: {
					'Content-type': 'application/json'
				}
			}
		);
		dispatch({ type: RESET_PASSWORD, payload: res.data });
		history.push('/dashboard');
		dispatch(setAlert('Success! New passsword has been set.', 'success'));
	});

export const changePassword = (
	{ currentPassword: password, newPassword },
	history
) =>
	catchAsync('update', async dispatch => {
		dispatch(resetAlert());
		dispatch({ type: LOADING_AUTH }); // need to load when we sumbmit a post or patch request

		// Send info to server that will send email.
		const res = await axios.post(
			`/api/users/updatePassword`,
			{ password, newPassword },
			{
				headers: {
					'Content-type': 'application/json'
				}
			}
		);
		dispatch({ type: CHANGE_PASSWORD, payload: res.data });
		history.push('/dashboard');
		dispatch(setAlert('Success! Password changed.', 'success'));
	});
