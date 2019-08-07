import { REGISTER_SUCCESS } from '../actions/types';

const initialState = {
	users: [],
	loading: true,
	error: {}
};

export default (state = initialState, action) => {
	const { type, payload } = action;

	switch (type) {
		case REGISTER_SUCCESS:
			console.log([...state.users, payload]);
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

		default:
			return state;
	}
};
