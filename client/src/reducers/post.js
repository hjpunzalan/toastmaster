import {
	POST_CREATE,
	GET_POST,
	GET_ALL_POST,
	UPDATE_POST,
	POST_ERROR,
	DELETE_POST,
	TOGGLE_CREATE_POST,
	TOGGLE_EDIT_POST,
	ADD_COMMENT
} from '../actions/types';

const initialState = {
	loading: true,
	posts: [],
	post: null,
	edit: false,
	postEdit: false,
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
		case TOGGLE_EDIT_POST:
			return {
				...state,
				postEdit: payload
			};
		case POST_CREATE:
			return {
				...state,
				edit: false,
				posts: [payload, ...state.posts]
			};
		case GET_POST:
			return {
				...state,
				edit: false,
				postEdit: false,
				post: payload
			};
		case GET_ALL_POST:
			return {
				...state,
				edit: false,
				postEdit: false,
				loading: false,
				post: null,
				posts: payload
			};
		case UPDATE_POST:
			return {
				...state,
				postEdit: false,
				post: payload
			};

		case DELETE_POST:
			return {
				...state,
				post: null,
				loading: true
			};
		case ADD_COMMENT:
			return {
				...state,
				post: { ...state.post, comments: payload }
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
