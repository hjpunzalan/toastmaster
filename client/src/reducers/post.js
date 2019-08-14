import {
	POST_CREATE,
	GET_POST,
	TOGGLE_CREATE_POST,
	ADD_COMMENT
} from '../actions/types';

const initialState = {
	loading: true,
	posts: [],
	post: null,
	edit: false,
	error: {}
};

export default (state = initialState, action) => {
	const { type, payload } = action;
	switch (type) {
		case TOGGLE_CREATE_POST:
			return {
				...state,
				contentState: {},
				edit: payload
			};
		case POST_CREATE:
			return {
				...state,
				edit: false,
				posts: [{ ...payload, comments: [] }, ...state.posts]
			};
		case GET_POST:
			return {
				...state,
				edit: false,
				loading: false,
				post: state.posts.find(p => p.id === payload)
			};
		case ADD_COMMENT:
			return {
				...state,
				post: { ...state.post, comments: [...state.post.comments, payload] }
			};

		default:
			return state;
	}
};
