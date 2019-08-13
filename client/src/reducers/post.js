import { POST_CREATE, ON_CHANGE, GET_POST } from '../actions/types';

const initialState = {
	loading: true,
	posts: [],
	post: null,
	contentState: {},
	edit: false,
	error: {}
};

export default (state = initialState, action) => {
	const { type, payload } = action;
	switch (type) {
		case ON_CHANGE:
			return {
				...state,
				loading: false,
				contentState: payload
			};
		case POST_CREATE:
			return {
				...state,
				edit: false,
				loading: false,
				posts: [payload, ...state.posts]
			};
		case GET_POST:
			return {
				...state,
				loading: false,
				post: state.posts.find(p => p.id === payload)
			};

		default:
			return state;
	}
};
