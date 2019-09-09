import {
	REGISTER_SUCCESS,
	GET_ALL_USERS,
	TOGGLE_MODERATOR
} from '../actions/types';

const initialState = {
	users: [],
	loading: true,
	error: {},
	Moderator: false
};

export default (state = initialState, action) => {
	const { type, payload } = action;

	switch (type) {
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

		default:
			return state;
	}
};
