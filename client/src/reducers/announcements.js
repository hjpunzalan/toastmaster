import {
	TOGGLE_CREATE_ANNOUNCEMENT,
	CREATE_ANNOUNCEMENT,
	GET_ALL_ANNOUNCEMENT,
	DELETE_ANNOUNCEMENT,
	UPDATE_ANNOUNCEMENT,
	LOADING_ANNOUNCEMENT_SUBMIT,
	ANNOUNCEMENT_ERROR
} from '../actions/types';

const initialState = {
	loading: true,
	edit: false,
	announcements: []
};

export default (state = initialState, action) => {
	const { type, payload } = action;
	switch (type) {
		case ANNOUNCEMENT_ERROR:
			return { ...state, loading: false };
		case LOADING_ANNOUNCEMENT_SUBMIT:
			return { ...state, loading: true };
		case TOGGLE_CREATE_ANNOUNCEMENT:
			return { ...state, edit: !state.edit };
		case CREATE_ANNOUNCEMENT:
			return {
				...state,
				loading: false,
				edit: false,
				announcements: [payload, ...state.announcements]
			};
		case GET_ALL_ANNOUNCEMENT:
			return {
				...state,
				loading: false,
				announcements: payload
			};
		default:
			return state;
	}
};