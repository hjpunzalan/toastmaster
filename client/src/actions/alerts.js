import { SET_ALERT, RESET_ALERT } from './types';

export const setAlert = (msg, alertType) => dispatch => {
	dispatch({
		type: SET_ALERT,
		payload: { msg, alertType }
	});
};

export const resetAlert = () => dispatch => {
	dispatch({ type: RESET_ALERT });
};
