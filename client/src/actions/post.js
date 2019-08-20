import {
	POST_CREATE,
	ON_CHANGE,
	GET_POST,
	UPDATE_POST,
	TOGGLE_CREATE_POST,
	ADD_COMMENT
} from '../actions/types';
import uuid from 'uuid/v4';
import axios from 'axios';
import { setAlert, resetAlert } from './alerts';
export const onChange = editorState => dispatch => {
	dispatch({
		type: ON_CHANGE,
		payload: editorState
	});
};

export const toggleCreatePost = edit => dispatch => {
	dispatch({
		type: TOGGLE_CREATE_POST,
		payload: !edit
	});
};

export const createPost = ({ title, contentState }) => async dispatch => {
	dispatch(resetAlert()); //Need to be in every action with alert
	// { title , user, date, contentState}
	// need to include auth
	try {
		const res = await axios.post(
			'/api/posts',
			{ title, contentState },
			{
				headers: {
					'Content-type': 'application/json'
				}
			}
		);

		dispatch({
			type: POST_CREATE,
			payload: res.data
		});
	} catch (err) {
		const errors = err.response.data;
		if (errors) dispatch(setAlert(errors.message, 'fail'));
	}
};

export const getPost = id => dispatch => {
	// need to re-edit this and obtain post from database
	dispatch({
		type: GET_POST,
		payload: id
	});
};

export const addComment = contentState => dispatch => {
	if (!contentState) {
		dispatch(setAlert('No comment added', 'fail'));
		return;
	}

	dispatch({
		type: ADD_COMMENT,
		payload: { contentState, id: uuid() }
	});
};

export const updatePost = ({
	postId,
	newTitle,
	newContentState
}) => dispatch => {
	dispatch(resetAlert());
	if (newTitle.length === 0) {
		dispatch(setAlert('Post needs a title', 'fail'));
	} else {
		dispatch({
			type: UPDATE_POST,
			payload: { title: newTitle, contentState: newContentState, id: postId }
		});

		dispatch(getPost(postId));
	}
};
