import { setAlert } from '../actions/alerts';
import { ERROR } from '../actions/types';

const catchAsync = fn => {
	return dispatch => {
		fn(dispatch).catch(err => {
			console.error(err);
			const errors = err.response.data;
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
