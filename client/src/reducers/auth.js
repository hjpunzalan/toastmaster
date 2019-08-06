import { LOGIN_SUCCESS, LOGIN_FAIL } from '../actions/types';

const initialState = {
	user: null,
	isAuthenticated: false,
	loading: true,
	error: {}
};

export default (state = initialState, action) => {
	const { type, payload } = action;

	switch (type) {
		case LOGIN_SUCCESS:
			return {
				//State needs to be first
				...state,
				user: payload,
				isAuthenticated: true,
				loading: false
			};
		case LOGIN_FAIL:
			return {
				...state,
				error: payload,
				loading: false
			};

		default:
			return state;
	}
};
