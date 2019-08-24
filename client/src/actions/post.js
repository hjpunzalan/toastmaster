import {
	POST_CREATE,
	GET_POST,
	GET_ALL_POST,
	UPDATE_POST,
	DELETE_POST,
	POST_ERROR,
	ON_CHANGE,
	TOGGLE_CREATE_POST,
	TOGGLE_EDIT_POST,
	ADD_COMMENT,
	DELETE_COMMENT
} from '../actions/types';
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
export const toggleEditPost = postEdit => dispatch => {
	dispatch({
		type: TOGGLE_EDIT_POST,
		payload: !postEdit
	});
};

export const createPost = ({ title, contentState }) => async dispatch => {
	dispatch(resetAlert()); //Need to be in every action with alert
	// { title , user, date, contentState}
	// need to include auth
	try {
		const jsonContentState = JSON.stringify(contentState);
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
		const res = await axios.get(`/api/posts?sort=-date`);
		dispatch({
			type: GET_ALL_POST,
			payload: res.data.posts
		});
	} catch (err) {
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

export const updatePost = ({
	postId,
	newTitle,
	newContentState
}) => async dispatch => {
	dispatch(resetAlert());
	const jsonContentState = JSON.stringify(newContentState);
	try {
		const config = {
			headers: {
				'Content-type': 'application/json'
			}
		};
		const res = await axios.patch(
			`/api/posts/${postId}`,
			{
				title: newTitle,
				contentState: jsonContentState
			},
			config
		);

		dispatch({
			type: UPDATE_POST,
			payload: res.data
		});

		dispatch(getPost(postId));
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

export const deletePost = (postId, history) => async dispatch => {
	try {
		await axios.delete(`/api/posts/${postId}`);
		dispatch({
			type: DELETE_POST
		});
		history.push('/discussion');
		dispatch(setAlert('Post Deleted', 'success'));
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

export const addComment = (contentState, postId) => async dispatch => {
	try {
		dispatch(resetAlert()); //Need to be in every action with alert
		const jsonContentState = JSON.stringify(contentState);
		const config = {
			headers: {
				'Content-type': 'application/json'
			}
		};
		const res = await axios.post(
			`/api/posts/${postId}`,
			{ contentState: jsonContentState },
			config
		);

		dispatch({
			type: ADD_COMMENT,
			payload: res.data
		}); // loads whilst posting comment
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

export const deleteComment = (postId, commentId) => async dispatch => {
	try {
		dispatch(resetAlert()); //Need to be in every action with alert
		const res = await axios.put(`/api/posts/${postId}/comments/${commentId}`);
		dispatch({
			type: DELETE_COMMENT,
			payload: res.data
		});

		dispatch(setAlert('Comment removed', 'success'));
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
