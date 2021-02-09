import {
	REGISTER_SUCCESS,
	GET_ALL_USERS,
	TOGGLE_MODERATOR,
	USER_ERROR,
	DEACTIVATE_USER,
	ACTIVATE_USER,
	LOADING_USER,
	MAKE_COMMITTEE,
	REMOVE_COMMITTEE,
} from "../actions/types";

export const initialState = {
	users: [],
	loading: true,
	error: {},
	Moderator: false,
};

const usersReducer = (state = initialState, action) => {
	const { type, payload } = action;

	const replaceUser = (id, userArray, newUser) => {
		const index = userArray.findIndex((el) => el._id === id);
		userArray[index] = newUser;
		return userArray;
	};

	switch (type) {
		case USER_ERROR:
			return { ...state, loading: false };
		case LOADING_USER:
			return { ...state, loading: true };
		case REGISTER_SUCCESS:
			return {
				//State needs to be first
				...state,
				users: [...state.users, payload],
				loading: false,
			};
		case GET_ALL_USERS:
			return {
				...state,
				loading: false,
				users: payload,
			};
		case TOGGLE_MODERATOR:
			return {
				...state,
				Moderator: !state.Moderator,
			};

		case DEACTIVATE_USER:
		case ACTIVATE_USER:
		case MAKE_COMMITTEE:
		case REMOVE_COMMITTEE:
			return {
				...state,
				users: replaceUser(payload._id, state.users, payload),
				loading: false,
			};

		default:
			return state;
	}
};

export default usersReducer;
