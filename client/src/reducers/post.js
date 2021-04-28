import {
	POST_CREATE,
	GET_POST,
	GET_ALL_POST,
	UPDATE_POST,
	DELETE_POST,
	TOGGLE_CREATE_POST,
	TOGGLE_EDIT_POST,
	ADD_COMMENT,
	DELETE_COMMENT,
	POST_RESET,
	SEARCH_POSTS,
	POST_ERROR,
	LOADING_SUBMIT_POST,
	POST_NEXT_PAGE,
	CLEAR_POST,
	GET_POST_ERROR
} from "../actions/types";

export const initialState = {
	loading: true,
	postLoading: true,
	posts: [],
	post: null,
	edit: false,
	postEdit: false,
	totalPages: null,
	postError: false
};

const postReducer = (state = initialState, action) => {
	const { type, payload } = action;
	switch (type) {
		case LOADING_SUBMIT_POST:
			return { ...state, loading: true, postLoading: true };
		case CLEAR_POST:
			return {
				...state,
				post: null,
			};
		case POST_RESET:
			return {
				...state,
				loading: true,
				posts: [],
				post: null,
				totalPages: null,
				postError: false
			};
		case TOGGLE_CREATE_POST:
			return {
				...state,
				edit: !state.edit,
			};
		case TOGGLE_EDIT_POST:
			return {
				...state,
				postEdit: !state.postEdit,
			};
		case POST_CREATE:
			return {
				...state,
				edit: false,
				postLoading: false,
				posts: [payload, ...state.posts],
			};
		case GET_POST:
			return {
				...state,
				edit: false,
				postLoading: false,
				postEdit: false,
				post: payload,
				postError: false
			};
		case GET_ALL_POST:
		case SEARCH_POSTS:
			return {
				...state,
				postEdit: false,
				loading: false,
				post: null,
				posts: payload.posts,
				totalPages: Math.ceil(payload.numPosts / payload.limit),
			};
		case POST_NEXT_PAGE:
			return {
				...state,
				edit: false,
				postEdit: false,
				loading: false,
				posts: [...state.posts, ...payload.posts],
				totalPages: Math.ceil(payload.numPosts / payload.limit),
			};
		case UPDATE_POST:
			return {
				...state,
				postLoading: false,
				postEdit: false,
				post: payload,
			};

		case DELETE_POST:
			return {
				...state,
				post: null,
				postLoading: true,
				loading: true,
			};
		case ADD_COMMENT:
		case DELETE_COMMENT:
			return {
				...state,
				postLoading: false,
				post: {
					...state.post,
					...payload,
				},
			};

		case POST_ERROR:
			return {
				...state,
				postLoading: false,
				loading: false,
			};
		case GET_POST_ERROR:
			return {
				...state,
				postLoading: false,
				totalPages: null,
				postError: true
			};

		default:
			return state;
	}
};

export default postReducer;
