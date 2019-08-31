import { SET_ALERT, RESET_ALERT } from './types';
import scrollToTop from '../utils/scrollToTop';

export const setAlert = (msg, alertType) => dispatch => {
	dispatch({
		type: SET_ALERT,
		payload: { msg, alertType }
	});
	scrollToTop();
};

export const resetAlert = () => dispatch => {
	dispatch({ type: RESET_ALERT });
};
