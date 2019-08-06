import { REGISTER_SUCCESS } from '../actions/types';

export const registerUser = formData => dispatch => {
	dispatch({
		type: REGISTER_SUCCESS,
		payload: formData
	});
};
