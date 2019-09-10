import { setAlert } from '../actions/alerts';
import {
	ERROR,
	POST_ERROR,
	ANNOUNCEMENT_ERROR,
	AUTH_ERROR,
	UPDATE_FAILED
} from '../actions/types';

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
			if (errors) dispatch(setAlert(errors.message, 'fail'));
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
