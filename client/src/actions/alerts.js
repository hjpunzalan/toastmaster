import { SET_ALERT, RESET_ALERT } from './types';

export const setAlert = (msg, alertType) => dispatch => {
	dispatch({
		type: SET_ALERT,
		payload: { msg, alertType }
	});
	const scrollToTop = () => {
		const c = document.documentElement.scrollTop || document.body.scrollTop;
		if (c > 0) {
			window.requestAnimationFrame(scrollToTop);
			window.scrollTo(0, c - c / 8);
		}
	};
	scrollToTop();
};

export const resetAlert = () => dispatch => {
	dispatch({ type: RESET_ALERT });
};
