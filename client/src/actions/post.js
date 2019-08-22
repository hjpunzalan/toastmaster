import {
	POST_CREATE,
	GET_POST,
	GET_ALL_POST,
	UPDATE_POST,
	POST_ERROR,
	ON_CHANGE,
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
	const jsonContentState = JSON.stringify(contentState);
	try {
		const res = await axios.post(
			'/api/posts',
			{ title, contentState: jsonContentState },
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
		dispatch({
			type: POST_ERROR,
			payload: {
				msg: err.response.statusText,
				status: err.response.status
			}
		});
	}
};

export const getAllPost = () => async dispatch => {
	try {
		const res = await axios.get(`/api/posts`);
		dispatch({
			type: GET_ALL_POST,
			payload: res.data.posts
		});
	} catch (err) {
		console.error(err);
		dispatch({
			type: POST_ERROR,
			payload: {
				msg: err.response.statusText,
				status: err.response.status
			}
		});
	}
};

export const getPost = id => async dispatch => {
	try {
		const res = await axios.get(`/api/posts/${id}`);
		dispatch({
			type: GET_POST,
			payload: res.data
		});
	} catch (error) {}
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
