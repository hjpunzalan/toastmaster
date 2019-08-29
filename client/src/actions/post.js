import {
	POST_CREATE,
	GET_POST,
	GET_ALL_POST,
	UPDATE_POST,
	DELETE_POST,
	TOGGLE_CREATE_POST,
	TOGGLE_EDIT_POST,
	ADD_COMMENT,
	DELETE_COMMENT,
	POST_RESET,
	SEARCH_POSTS
} from './types';
import axios from 'axios';
import { setAlert, resetAlert } from './alerts';
import catchAsync from '../hooks/catchAsync';

export const toggleCreatePost = edit => dispatch => {
	dispatch(resetAlert());
	dispatch({
		type: TOGGLE_CREATE_POST,
		payload: !edit
	});
};
export const toggleEditPost = postEdit => dispatch => {
	dispatch(resetAlert());
	dispatch({
		type: TOGGLE_EDIT_POST,
		payload: !postEdit
	});
};

export const createPost = (title, contentState, history, plainText) =>
	catchAsync(async dispatch => {
		dispatch(resetAlert()); //Need to be in every post/put/patch action with alert
		const jsonContentState = JSON.stringify(contentState);
		// Need to be in edit also
		const body = { title, contentState: jsonContentState, plainText };
		const res = await axios.post('/api/posts', body, {
			headers: {
				'Content-type': 'application/json'
			}
		});
		const postId = res.data._id;

		dispatch({
			type: POST_CREATE,
			payload: res.data
		});
		history.push(`/discussion/post/${postId}`);
	});

export const getAllPost = (page = 1) =>
	catchAsync(async dispatch => {
		dispatch({
			type: POST_RESET
		}); // for pagination only
		const limit = 1;
		const res = await axios.get(
			`/api/posts?page=${page}&limit=${limit}&sort=-date`
		);
		dispatch({
			type: GET_ALL_POST,
			payload: {
				...res.data,
				limit
			}
		});
	});

export const getPost = (id, pageQuery, history, page, callback) =>
	catchAsync(async dispatch => {
		const res = await axios.get(`/api/posts/${id}`);

		const comments = res.data.comments;
		const totalPages = Math.ceil(comments.length / 6) || 1; // pagelimit = 10 }
		dispatch({
			type: GET_POST,
			payload: {
				...res.data,
				totalPages
			}
		});
		if ((pageQuery, history, page, callback))
			if (isNaN(pageQuery) || pageQuery > totalPages || page > totalPages) {
				history.push(`/discussion/post/${id}`);
				callback(1);
			}
	});

export const updatePost = (postId, newTitle, newContentState, plainText) =>
	catchAsync(async dispatch => {
		dispatch(resetAlert());
		const jsonContentState = JSON.stringify(newContentState);
		const config = {
			headers: {
				'Content-type': 'application/json'
			}
		};
		const body = { title: newTitle, contentState: jsonContentState, plainText };
		const res = await axios.patch(`/api/posts/${postId}`, body, config);

		dispatch({
			type: UPDATE_POST,
			payload: res.data
		});
		dispatch(getPost(postId));
	});

export const deletePost = (postId, history) =>
	catchAsync(async dispatch => {
		if (window.confirm('Are you sure you want to delete post?')) {
			await axios.delete(`/api/posts/${postId}`);
			dispatch({
				type: DELETE_POST
			});
			history.push('/discussion');
			dispatch(setAlert('Post Deleted', 'success'));
		} else {
			return;
		}
	});

export const addComment = (contentState, postId, history, callback) =>
	catchAsync(async dispatch => {
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
		const comments = res.data;
		const totalPages = Math.ceil(comments.length / 6) || 1; // pagelimit = 10 }

		dispatch({
			type: ADD_COMMENT,
			payload: {
				comments,
				totalPages
			}
		}); // loads whilst posting comment

		// Redirect to last page when sending comment
		history.push(`/discussion/post/${postId}?page=${totalPages}`);
		callback(totalPages);
	});

export const deleteComment = (postId, commentId, history, page, callback) =>
	catchAsync(async dispatch => {
		dispatch(resetAlert()); //Need to be in every action with alert
		const res = await axios.put(`/api/posts/${postId}/comments/${commentId}`);

		const comments = res.data;
		const totalPages = Math.ceil(comments.length / 6) || 1; // pagelimit = 10
		dispatch({
			type: DELETE_COMMENT,
			payload: {
				comments,
				totalPages
			}
		});
		if (page > totalPages) {
			history.push(`/discussion/post/${postId}?page=${totalPages}`);
			callback(totalPages);
		}
		dispatch(setAlert('Comment removed', 'success'));
	});

export const searchPost = (text, page = 1) =>
	catchAsync(async dispatch => {
		dispatch(resetAlert()); //Need to be in every action with alert
		dispatch({ type: POST_RESET });
		const limit = 1;
		const config = {
			headers: {
				'Content-type': 'application/json'
			}
		};
		const res = await axios.post(
			`/api/posts/search/text?sort=-date&page=${page}&limit=${limit}`,
			{ text },
			config
		);
		dispatch({
			type: SEARCH_POSTS,
			payload: {
				...res.data,
				limit
			}
		});
	});
