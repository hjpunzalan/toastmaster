import {
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	LOGOUT,
	CLEAR_LOGIN,
	AUTH_ERROR,
	UPDATE_ME,
	LOADING_USER,
	TOGGLE_UPDATE_ME
} from '../actions/types';

const initialState = {
	currentUser: null,
	isAuthenticated: false,
	loading: true,
	edit: false,
	isModified: false
};

export default (state = initialState, action) => {
	const { type, payload } = action;

	switch (type) {
		case TOGGLE_UPDATE_ME:
			return {
				...state,
				edit: payload
			};
		case LOADING_USER:
			if (payload === 'load-only') return { ...state, loading: true };
			break;
		case CLEAR_LOGIN:
			return {
				...state,
				currentUser: null,
				isAuthenticated: false,
				loading: true
			};
		case LOGIN_SUCCESS:
			return {
				//State needs to be first
				...state,
				currentUser: payload,
				isAuthenticated: true,
				loading: false
			};
		case LOGOUT:
		case LOGIN_FAIL:
		case AUTH_ERROR:
			return {
				...state,
				isAuthenticated: false,
				loading: false
			};

		case UPDATE_ME:
			return {
				...state,
				loading: false,
				currentUser: payload,
				isModified: true
			};

		default:
			return state;
	}
};
