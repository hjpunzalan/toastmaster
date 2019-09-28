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
	LOADING_SUBMIT_POST,
	SEARCH_POSTS,
	POST_NEXT_PAGE,
	CLEAR_POST
} from './types';
import axios from 'axios';
import { setAlert, resetAlert } from './alerts';
import catchAsync from '../utils/catchAsync';

// Pagination limit
const limit = 7;

export const toggleCreatePost = () => dispatch => {
	dispatch(resetAlert());
	dispatch({ type: TOGGLE_CREATE_POST });
};
export const toggleEditPost = () => dispatch => {
	dispatch(resetAlert());
	dispatch({ type: TOGGLE_EDIT_POST });
};

export const createPost = (title, contentState, history, plainText) =>
	catchAsync('post', async dispatch => {
		dispatch(resetAlert()); //Need to be in every post/put/patch action with alert
		const jsonContentState = JSON.stringify(contentState);
		// This makes it more UX friendly calling a spinner instantly
		dispatch({ type: LOADING_SUBMIT_POST });
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
	catchAsync('post', async dispatch => {
		// clears post when switching between post
		dispatch({
			type: CLEAR_POST
		});
		// check reducers when changing limit
		// Gets post by page by limit and sorts by last comment then date.
		const res = await axios.get(
			`/api/posts?page=${page}&limit=${limit}&sort=-lastComment,-date`
		);
		dispatch({
			type: GET_ALL_POST,
			payload: {
				...res.data,
				limit
			}
		});
	});

// With and without searching
// isSearch is boolean || string
// setPage is here to trigger the loader
export const postNextPage = (page, setPage, isSearch = false) =>
	catchAsync(async dispatch => {
		// Gets post by page by limit and sorts by last comment then date.
		let res;
		const nextPage = page + 1;
		if (isSearch) {
			const config = {
				headers: {
					'Content-type': 'application/json'
				}
			};
			res = await axios.post(
				`/api/posts/search/text?page=${nextPage}&limit=${limit}&sort=-lastComment,-date`,
				{ text: isSearch },
				config
			);
		} else {
			res = await axios.get(
				`/api/posts?page=${nextPage}&limit=${limit}&sort=-lastComment,-date`
			);
		}
		dispatch({
			type: POST_NEXT_PAGE,
			payload: {
				...res.data,
				limit
			}
		});
		setPage(nextPage);
	});

export const getPost = (id, pageQuery, history, page, callback) =>
	catchAsync('post', async dispatch => {
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
	catchAsync('post', async dispatch => {
		dispatch(resetAlert());
		// This makes it more UX friendly calling a spinner instantly
		dispatch({ type: LOADING_SUBMIT_POST });
		const jsonContentState = JSON.stringify(newContentState);
		const config = {
			headers: {
				'Content-type': 'application/json'
			}
		};
		const body = {
			title: newTitle,
			contentState: jsonContentState,
			plainText
		};
		const res = await axios.patch(`/api/posts/${postId}`, body, config);

		dispatch({
			type: UPDATE_POST,
			payload: res.data
		});
		dispatch(getPost(postId));
	});

export const deletePost = (postId, history) =>
	catchAsync('post', async dispatch => {
		if (window.confirm('Are you sure you want to delete post?')) {
			// This considers if somehow the request takes a long time
			dispatch({ type: LOADING_SUBMIT_POST });
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
	catchAsync('post', async dispatch => {
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
	catchAsync('post', async dispatch => {
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
	catchAsync('post', async dispatch => {
		dispatch(resetAlert()); //Need to be in every action with alert
		dispatch({ type: POST_RESET });
		const config = {
			headers: {
				'Content-type': 'application/json'
			}
		};
		const res = await axios.post(
			`/api/posts/search/text?page=${page}&limit=${limit}&sort=-lastComment,-date`,
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
