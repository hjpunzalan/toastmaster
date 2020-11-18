import { SET_ALERT, RESET_ALERT } from "./types";
import scrollToTop from "../utils/scrollToTop";

export const setAlert = (msg, alertType) => (dispatch) => {
	// Dispatch alert message
	dispatch({
		type: SET_ALERT,
		payload: { msg, alertType },
	});
	// Scroll to top of page
	scrollToTop();
};

export const resetAlert = () => (dispatch) => {
	dispatch({ type: RESET_ALERT });
};
