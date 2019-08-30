import { LOGIN_SUCCESS, LOGIN_FAIL, AUTH_ERROR } from '../actions/types';

const initialState = {
	user: null,
	isAuthenticated: false,
	loading: false
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
		case AUTH_ERROR:
			return {
				...state,
				isAuthenticated: false,
				loading: false
			};

		default:
			return state;
	}
};
