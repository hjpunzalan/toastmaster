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
	CLEAR_POST,
} from "./types";
import axios from "axios";
import { setAlert, resetAlert } from "./alerts";
import catchAsync from "../utils/catchAsync";

// Pagination limit for get all post and post next page
const postLimitPerPage = 7;
const commentsLimitPerPage = 6;

export const toggleCreatePost = () => (dispatch) => {
	// Clear any previous alert
	dispatch(resetAlert());
	// Change create post state
	dispatch({ type: TOGGLE_CREATE_POST });
};
export const toggleEditPost = () => (dispatch) => {
	// Clear any previous alert
	dispatch(resetAlert());
	// Change edit post state
	dispatch({ type: TOGGLE_EDIT_POST });
};

export const createPost = ({ title, contentState, history, plainText }) =>
	catchAsync("post", async (dispatch) => {
		// Need to be in every post/put/patch action with alert
		// If request fails there may be an alert for the error
		dispatch(resetAlert());
		// This makes it more UX friendly calling a spinner instantly
		// Change loading state within postLoading and post group
		// Post group loading to update and load all the posts again
		dispatch({ type: LOADING_SUBMIT_POST });
		// Send request with appropriate body
		const jsonContentState = JSON.stringify(contentState);
		const body = { title, contentState: jsonContentState, plainText };
		const res = await axios.post("/api/posts", body);
		// Obtain post id from response
		const postId = res.data._id;
		// Dispatch post create and change postLoading to false
		dispatch({
			type: POST_CREATE,
			payload: res.data,
		});
		// Navigate user to the new post page
		history.push(`/discussion/post/${postId}`);
	});

export const getAllPost = (page = 1) =>
	catchAsync("post", async (dispatch) => {
		// Resets alert if searching for empty posts beforehand
		// Empty posts from search will result in an error alert
		dispatch(resetAlert());
		// Gets post by page with limit, sorts by last comment then date.
		const res = await axios.get(
			`/api/posts?page=${page}&limit=${postLimitPerPage}&sort=,-lastEdited,-lastComment`
		);
		// Dispatch data and change posts state
		dispatch({
			type: GET_ALL_POST,
			payload: {
				...res.data,
				limit: postLimitPerPage,
			},
		});
	});

// With and without searching
// isSearch is boolean || string
// setPage from component state is passed to trigger the loader from InfiniteScroll component
export const postNextPage = (page, setPage, isSearch = false) =>
	catchAsync(async (dispatch) => {
		let res;
		const nextPage = page + 1;
		// Gets post by page with limit ,sorts by last comment then date.
		if (isSearch) {
			res = await axios.post(
				`/api/posts/search/text?page=${nextPage}&limit=${postLimitPerPage}&sort=-lastComment,-date`,
				{ text: isSearch }
			);
		} else {
			res = await axios.get(
				`/api/posts?page=${nextPage}&limit=${postLimitPerPage}&sort=-lastComment,-date`
			);
		}
		if (res.data) {
			dispatch({
				type: POST_NEXT_PAGE,
				payload: {
					...res.data,
					postLimitPerPage,
				},
			});
			// Change page state only after request has been made
			// If request fails, state does not change
			// Page number remains the same
			setPage(nextPage);
		}
	});

export const getPost = ({ id, currentPage, history, setPage }) =>
	catchAsync("post", async (dispatch) => {
		// Clear previous post state
		dispatch({
			type: CLEAR_POST,
		});
		// Make request with post id
		const res = await axios.get(`/api/posts/${id}`);
		// Calculate total amount pages (client-side pagination)
		const comments = res.data.comments;
		// Consider if there's no comments made
		const totalPages = Math.ceil(comments.length / commentsLimitPerPage) || 1;
		// Update post state
		dispatch({
			type: GET_POST,
			payload: {
				...res.data,
				totalPages,
			},
		});

		// Redirect user if attempting to access invalid page query
		if (isNaN(currentPage) || currentPage > totalPages) {
			history.push(`/discussion/post/${id}`);
			setPage(1);
		}
	});

export const updatePost = ({ postId, newTitle, newContentState, plainText }) =>
	catchAsync("post", async (dispatch) => {
		dispatch(resetAlert());
		// This makes it more UX friendly calling a spinner instantly
		dispatch({ type: LOADING_SUBMIT_POST });
		// Convert contentstate object to JSON
		const jsonContentState = JSON.stringify(newContentState);
		// Make request to update post
		const body = {
			title: newTitle,
			contentState: jsonContentState,
			plainText,
		};
		const res = await axios.patch(`/api/posts/${postId}`, body);
		// Dispatch update post action and change loading state
		dispatch({
			type: UPDATE_POST,
			payload: res.data,
		});
	});

export const deletePost = (postId, history) =>
	catchAsync("post", async (dispatch) => {
		// Prompt user to confirm deletion
		if (window.confirm("Are you sure you want to delete post?")) {
			// This considers if somehow the request takes a long time
			dispatch({ type: LOADING_SUBMIT_POST });
			// Make request to delete post
			await axios.delete(`/api/posts/${postId}`);
			// Dispatch delete post and stop loading
			dispatch({
				type: DELETE_POST,
			});
			// Navigate user back to discussion board
			history.push("/discussion");
			// Send alert to user post was deleted
			dispatch(setAlert("Post Deleted", "success"));
		} else {
			return;
		}
	});

export const addComment = ({ contentState, postId, history, setPage }) =>
	catchAsync("post", async (dispatch) => {
		// Require to reset alert possibly from removing comment
		dispatch(resetAlert());
		// Convert contentstate object to JSON
		const jsonContentState = JSON.stringify(contentState);
		// Make request to add comment to server
		const res = await axios.post(`/api/posts/${postId}`, {
			contentState: jsonContentState,
		});
		// Calculate total pages after new comment was added
		const comments = res.data;
		const totalPages = Math.ceil(comments.length / commentsLimitPerPage) || 1;
		// Dispatch add comment action
		dispatch({
			type: ADD_COMMENT,
			payload: {
				comments,
				totalPages,
			},
		}); // loads whilst posting comment

		// Redirect to the last page when sending comment
		history.push(`/discussion/post/${postId}?page=${totalPages}`);
		setPage(totalPages);
	});

export const deleteComment = ({ postId, commentId, history, page, setPage }) =>
	catchAsync("post", async (dispatch) => {
		// Require to reset alert from removing comment
		dispatch(resetAlert());
		// Send request to delete comment from post with postId
		const res = await axios.put(`/api/posts/${postId}/comments/${commentId}`);
		// Calculate total pages
		const comments = res.data;
		const totalPages = Math.ceil(comments.length / commentsLimitPerPage) || 1; // pagelimit = 10
		// Dispatch delete comment action
		dispatch({
			type: DELETE_COMMENT,
			payload: {
				comments,
				totalPages,
			},
		});
		// If current page number is higher than total amount of pages
		// Redirect user
		if (page > totalPages) {
			history.push(`/discussion/post/${postId}?page=${totalPages}`);
			setPage(totalPages);
		}
		// Send alert to user
		dispatch(setAlert("Comment removed", "success"));
	});

export const searchPost = (text, page = 1) =>
	catchAsync("post", async (dispatch) => {
		// Clear possible alert from empty searches
		dispatch(resetAlert());
		// Clear post list state
		dispatch({ type: POST_RESET });
		// Make request to search post
		const res = await axios.post(
			`/api/posts/search/text?page=${page}&limit=${postLimitPerPage}&sort=-lastComment,-date`,
			{ text }
		);
		// Dispatch search post action and update state
		dispatch({
			type: SEARCH_POSTS,
			payload: {
				...res.data,
				limit: postLimitPerPage,
			},
		});
	});
