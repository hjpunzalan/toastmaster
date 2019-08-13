import { POST_CREATE, ON_CHANGE, GET_POST } from '../actions/types';
import uuid from 'uuid/v4';
import { setAlert, resetAlert } from './alerts';
export const onChange = editorState => dispatch => {
	dispatch({
		type: ON_CHANGE,
		payload: editorState
	});
};

export const createPost = ({
	title,
	contentState,
	toggle,
	setToggle
}) => dispatch => {
	dispatch(resetAlert()); //Need to be in every action with alert
	// { title , user, date, contentState}
	// need to include auth
	if (title.length === 0) {
		dispatch(setAlert('Post needs a title', 'fail'));
		return;
	}
	dispatch({
		type: POST_CREATE,
		payload: { title, contentState, id: uuid() }
	});

	toggle && setToggle(false);
};

export const getPost = id => dispatch => {
	// need to re-edit this and obtain post from database
	dispatch({
		type: GET_POST,
		payload: id
	});
};
