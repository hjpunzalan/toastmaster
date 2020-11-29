import { ON_CHANGE } from "../actions/types";

const initialState = {
	// This state is for creating/editing announcements,post and comments
	// For the current editor on page
	// ONLY one editor per page!
	contentState: {},
};

const textEditorReducer = (state = initialState, action) => {
	const { payload, type } = action;
	switch (type) {
		case ON_CHANGE:
			return {
				...state,
				contentState: payload,
			};
		default:
			return state;
	}
};

export default textEditorReducer;
