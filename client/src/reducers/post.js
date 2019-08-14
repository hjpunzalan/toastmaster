import {
	POST_CREATE,
	ON_CHANGE,
	GET_POST,
	TOGGLE_CREATE_POST,
	ADD_COMMENT
} from '../actions/types';

const initialState = {
	loading: true,
	posts: [],
	post: null,
	contentState: {}, //need to refactor into a separate reducer
	edit: false,
	error: {}
};

export default (state = initialState, action) => {
	const { type, payload } = action;
	switch (type) {
		case TOGGLE_CREATE_POST:
			return {
				...state,
				edit: payload
			};
		case ON_CHANGE:
			return {
				...state,
				contentState: payload //need to refactor into separate global state
			};
		case POST_CREATE:
			return {
				...state,
				edit: false,
				posts: [{ ...payload, comments: [] }, ...state.posts],
				contentState: {}
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
				post: { ...state.post, comments: [...state.post.comments, payload] },
				contentState: {}
			};

		default:
			return state;
	}
};
