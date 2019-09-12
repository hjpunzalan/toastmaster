import { setAlert } from '../actions/alerts';
import {
	ERROR,
	POST_ERROR,
	ANNOUNCEMENT_ERROR,
	AUTH_ERROR,
	UPDATE_FAILED,
	USER_ERROR
} from '../actions/types';
import { logoutUser } from '../actions/auth';

// So when only one argument is provided, it will be fn
const catchAsync = (type, fn = type) => {
	return dispatch => {
		fn(dispatch).catch(err => {
			console.error(err);
			const errors = err.response.data;
			// The types handles when loading is still true
			if (type === 'post') dispatch({ type: POST_ERROR });
			if (type === 'auth') dispatch({ type: AUTH_ERROR });
			if (type === 'update') dispatch({ type: UPDATE_FAILED });
			if (type === 'announcement') dispatch({ type: ANNOUNCEMENT_ERROR });
			if (type === 'user') dispatch({ type: USER_ERROR });
			if (errors) dispatch(setAlert(errors.message, 'fail'));
			// Log user out if deactivated
			console.log(err.response.status);
			if (err.response.status === 401) {
				dispatch(logoutUser());
			}
			dispatch({
				type: ERROR,
				payload: {
					msg: err.response.statusText,
					status: err.response.status
				}
			});
		});
	};
};

export default catchAsync;
