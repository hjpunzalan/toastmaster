import {
	LOGIN_SUCCESS,
	LOGOUT,
	CLEAR_LOGIN,
	AUTH_ERROR,
	UPDATE_ME,
	UPDATE_FAILED,
	LOADING_AUTH,
	FORGOT_PASSWORD,
	RESET_PASSWORD,
	CHANGE_PASSWORD,
} from "../actions/types";

const initialState = {
	currentUser: null,
	isAuthenticated: false,
	loading: true,
	isModified: false,
};

const authReducer = (state = initialState, action) => {
	const { type, payload } = action;

	switch (type) {
		case LOADING_AUTH:
			return { ...state, loading: true };
		case CLEAR_LOGIN:
			return {
				...state,
				currentUser: null,
				isAuthenticated: false,
				loading: true,
			};
		case LOGIN_SUCCESS:
		case RESET_PASSWORD:
		case CHANGE_PASSWORD:
			return {
				//State needs to be first
				...state,
				currentUser: payload,
				isAuthenticated: true,
				loading: false,
			};
		case FORGOT_PASSWORD:
		case LOGOUT:
		case AUTH_ERROR:
			return {
				...state,
				isAuthenticated: false,
				loading: false,
			};

		case UPDATE_ME:
			return {
				...state,
				loading: false,
				currentUser: payload,
				isModified: true,
			};
		case UPDATE_FAILED:
			return {
				...state,
				loading: false,
			};

		default:
			return state;
	}
};

export default authReducer;
