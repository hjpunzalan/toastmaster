import { POST_CREATE, ON_CHANGE, GET_POST } from '../actions/types';
import uuid from 'uuid/v4';
export const onChange = editorState => dispatch => {
	dispatch({
		type: ON_CHANGE,
		payload: editorState
	});
};

export const createPost = ({ title, contentState }) => dispatch => {
	// { title , user, date, contentState}
	// need to include auth

	dispatch({
		type: POST_CREATE,
		payload: { title, contentState, id: uuid() }
	});
};

export const getPost = id => dispatch => {
	// need to re-edit this and obtain post from database
	dispatch({
		type: GET_POST,
		payload: id
	});
};
