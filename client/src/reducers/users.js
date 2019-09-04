import { REGISTER_SUCCESS, GET_ALL_USERS } from '../actions/types';

const initialState = {
	users: [],
	loading: true,
	error: {}
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
				users: payload
			};

		default:
			return state;
	}
};
