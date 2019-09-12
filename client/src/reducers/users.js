import {
	REGISTER_SUCCESS,
	GET_ALL_USERS,
	TOGGLE_MODERATOR,
	USER_ERROR,
	DEACTIVATE_USER,
	ACTIVATE_USER,
	LOADING_USER
} from '../actions/types';

const initialState = {
	users: [],
	loading: true,
	error: {},
	Moderator: false
};

export default (state = initialState, action) => {
	const { type, payload } = action;

	const replaceUser = (id, userArray, newUser) => {
		const index = userArray.findIndex(el => el._id === id);
		userArray[index] = newUser;
		return userArray;
	};

	switch (type) {
		case USER_ERROR:
			return { ...state, loading: false };
		case LOADING_USER:
			return { ...state, loading: true };
		case REGISTER_SUCCESS:
			localStorage.setItem(
				'users',
				JSON.stringify([...state.users, ...payload])
			);
			return {
				//State needs to be first
				...state,
				users: [...state.users, ...payload],
				loading: false
			};
		case GET_ALL_USERS:
			return {
				...state,
				loading: false,
				users: payload
			};
		case TOGGLE_MODERATOR:
			return {
				...state,
				Moderator: !state.Moderator
			};

		case DEACTIVATE_USER:
		case ACTIVATE_USER:
			return {
				...state,
				users: replaceUser(payload._id, state.users, payload),
				loading: false
			};

		default:
			return state;
	}
};
