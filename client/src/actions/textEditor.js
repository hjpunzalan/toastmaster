import { ON_CHANGE } from './types';

export const onChange = editorState => dispatch => {
	dispatch({
		type: ON_CHANGE,
		payload: editorState
	});
};
