import {
	POST_CREATE,
	GET_POST,
	GET_ALL_POST,
	UPDATE_POST,
	DELETE_POST,
	TOGGLE_CREATE_POST,
	TOGGLE_EDIT_POST,
	ADD_COMMENT,
	DELETE_COMMENT
} from '../actions/types';

const initialState = {
	loading: true,
	posts: [],
	post: null,
	edit: false,
	postEdit: false
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
				post: {
					...payload,
					totalPages: Math.ceil(payload.comments.length / 6) || 1 // pagelimit = 10
				}
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
				post: {
					...state.post,
					...payload
				}
			};
		case DELETE_COMMENT:
			return {
				...state,
				post: {
					...state.post,
					...payload
				}
			};

		default:
			return state;
	}
};
