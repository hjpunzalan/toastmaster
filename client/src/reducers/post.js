import {
	POST_CREATE,
	GET_POST,
	GET_ALL_POST,
	UPDATE_POST,
	POST_ERROR,
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
				posts: [...state.posts, payload]
			};
		case GET_POST:
			return {
				...state,
				edit: false,
				loading: false,
				post: payload
			};
		case GET_ALL_POST:
			return {
				...state,
				edit: false,
				loading: false,
				post: null,
				posts: payload
			};
		case UPDATE_POST:
			const index = state.posts.indexOf(
				state.posts.find(p => p.id === payload.id)
			);

			let newPosts = state.posts;
			newPosts[index] = {
				...payload,
				comments: state.posts[index].comments
			};
			return {
				...state,
				edit: false,
				posts: newPosts
			};
		case ADD_COMMENT:
			return {
				...state,
				post: { ...state.post, comments: [...state.post.comments, payload] }
			};

		case POST_ERROR:
			return {
				...state,
				error: { ...payload }
			};

		default:
			return state;
	}
};
