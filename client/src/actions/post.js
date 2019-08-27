import {
	POST_CREATE,
	GET_POST,
	GET_ALL_POST,
	UPDATE_POST,
	DELETE_POST,
	ON_CHANGE,
	TOGGLE_CREATE_POST,
	TOGGLE_EDIT_POST,
	ADD_COMMENT,
	DELETE_COMMENT
} from '../actions/types';
import axios from 'axios';
import { setAlert, resetAlert } from './alerts';
import catchAsync from '../hooks/catchAsync';

export const onChange = editorState => dispatch => {
	dispatch({
		type: ON_CHANGE,
		payload: editorState
	});
};

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

export const createPost = ({ title, contentState }) =>
	catchAsync(async dispatch => {
		dispatch(resetAlert()); //Need to be in every action with alert
		// { title , user, date, contentState}
		// need to include auth
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
	});

export const getAllPost = () =>
	catchAsync(async dispatch => {
		const res = await axios.get(`/api/posts?sort=-date`);
		dispatch({
			type: GET_ALL_POST,
			payload: res.data.posts
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

export const updatePost = ({ postId, newTitle, newContentState }) =>
	catchAsync(async dispatch => {
		dispatch(resetAlert());
		const jsonContentState = JSON.stringify(newContentState);
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
	});

export const deletePost = (postId, history) =>
	catchAsync(async dispatch => {
		await axios.delete(`/api/posts/${postId}`);
		dispatch({
			type: DELETE_POST
		});
		history.push('/discussion');
		dispatch(setAlert('Post Deleted', 'success'));
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
