import {
	TOGGLE_CREATE_ANNOUNCEMENT,
	CREATE_ANNOUNCEMENT,
	GET_ALL_ANNOUNCEMENT,
	DELETE_ANNOUNCEMENT,
	UPDATE_ANNOUNCEMENT,
	LOADING_ANNOUNCEMENT_SUBMIT,
	ANNOUNCEMENT_ERROR,
} from "../actions/types";

const initialState = {
	loading: true,
	edit: false,
	announcements: [],
};

const announcementReducer = (state = initialState, action) => {
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
				announcements: [payload, ...state.announcements],
			};
		case UPDATE_ANNOUNCEMENT:
			const filterAnnouncement = state.announcements.filter(
				(el) => payload._id !== el._id
			);
			return {
				...state,
				loading: false,
				edit: false,
				announcements: [payload, ...filterAnnouncement], //top of array
			};
		case DELETE_ANNOUNCEMENT:
			return {
				...state,
				loading: false,
				announcements: state.announcements.filter((el) => payload !== el._id),
			};
		case GET_ALL_ANNOUNCEMENT:
			return {
				...state,
				loading: false,
				announcements: payload,
			};
		default:
			return state;
	}
};

export default announcementReducer;
