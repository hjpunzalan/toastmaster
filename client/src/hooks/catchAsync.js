import { setAlert } from '../actions/alerts';
import { ERROR, POST_ERROR, LOGIN_FAIL, AUTH_ERROR } from '../actions/types';

const catchAsync = (type, fn) => {
	return dispatch => {
		fn(dispatch).catch(err => {
			console.error(err);
			const errors = err.response.data;
			if (type === 'post') dispatch({ type: POST_ERROR });
			if (type === 'login') dispatch({ type: LOGIN_FAIL });
			if (type === 'auth') dispatch({ type: AUTH_ERROR });
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
