import { ON_CHANGE } from "./types";
// This state is for creating/editing announcements,post and comments
// For the current editor on page
// ONLY one editor per page!
export const onChange = (editorState) => (dispatch) => {
	dispatch({
		type: ON_CHANGE,
		payload: editorState,
	});
};
