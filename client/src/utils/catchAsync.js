import { setAlert } from "../actions/alerts";
import {
	ERROR,
	POST_ERROR,
	ANNOUNCEMENT_ERROR,
	AUTH_ERROR,
	UPDATE_FAILED,
	USER_ERROR,
	GET_POST_ERROR,
	LOGOUT
} from "../actions/types";
import { logoutUser } from "../actions/auth";

// So when only one argument is provided, it will be fn
const catchAsync = (type, fn = type) => {
	return async (dispatch) => {
		await fn(dispatch).catch(async (err) => {
			// If server fails logout user
			if (err.response.status === 500) return dispatch({ type: LOGOUT })
			
			// The types handles when loading is still true
			if (err.response.data.message) dispatch(setAlert(err.response.data.message, "fail"));
			if (type === "post") dispatch({ type: POST_ERROR });
			if (type === "getpost") dispatch({ type: GET_POST_ERROR });
			if (type === "auth") dispatch({ type: AUTH_ERROR });
			if (type === "update") dispatch({ type: UPDATE_FAILED });
			if (type === "announcement") dispatch({ type: ANNOUNCEMENT_ERROR });
			if (type === "user") dispatch({ type: USER_ERROR });
			// Log user out if deactivated --- 401 Unauthorized
			// Log out user if roles changed --- 403  Forbidden
			if (err.response.status === 401 || err.response.status === 403) {
				// Remove the cookie
				await dispatch(logoutUser());
			}
			dispatch({
				type: ERROR,
				payload: {
					msg: err.response.data.message,
					status: err.response.status,
				},
			});
		});
	};
};

export default catchAsync;