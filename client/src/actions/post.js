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
const limit = 7;

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

export const createPost = (title, contentState, history, plainText) =>
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
		const res = await axios.post("/api/posts", body, {
			headers: {
				"Content-type": "application/json",
			},
		});
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
			`/api/posts?page=${page}&limit=${limit}&sort=-lastComment,-date`
		);
		// Dispatch data and change posts state
		dispatch({
			type: GET_ALL_POST,
			payload: {
				...res.data,
				limit,
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
				`/api/posts/search/text?page=${nextPage}&limit=${limit}&sort=-lastComment,-date`,
				{ text: isSearch }
			);
		} else {
			res = await axios.get(
				`/api/posts?page=${nextPage}&limit=${limit}&sort=-lastComment,-date`
			);
		}
		if (res.data) {
			dispatch({
				type: POST_NEXT_PAGE,
				payload: {
					...res.data,
					limit,
				},
			});
			// Change page state only after request has been made
			// If request fails, state does not change
			// Page number remains the same
			setPage(nextPage);
		}
	});

export const getPost = (id, currentPage, history, page) =>
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
		const limitPerPage = 6;
		const totalPages = Math.ceil(comments.length / limitPerPage) || 1; // pagelimit = 10 }
		// Update post state
		dispatch({
			type: GET_POST,
			payload: {
				...res.data,
				totalPages,
			},
		});
	});

export const updatePost = (postId, newTitle, newContentState, plainText) =>
	catchAsync("post", async (dispatch) => {
		dispatch(resetAlert());
		// This makes it more UX friendly calling a spinner instantly
		dispatch({ type: LOADING_SUBMIT_POST });
		const jsonContentState = JSON.stringify(newContentState);
		const config = {
			headers: {
				"Content-type": "application/json",
			},
		};
		const body = {
			title: newTitle,
			contentState: jsonContentState,
			plainText,
		};
		const res = await axios.patch(`/api/posts/${postId}`, body, config);

		dispatch({
			type: UPDATE_POST,
			payload: res.data,
		});
		dispatch(getPost(postId));
	});

export const deletePost = (postId, history) =>
	catchAsync("post", async (dispatch) => {
		if (window.confirm("Are you sure you want to delete post?")) {
			// This considers if somehow the request takes a long time
			dispatch({ type: LOADING_SUBMIT_POST });
			await axios.delete(`/api/posts/${postId}`);
			dispatch({
				type: DELETE_POST,
			});
			history.push("/discussion");
			dispatch(setAlert("Post Deleted", "success"));
		} else {
			return;
		}
	});

export const addComment = (contentState, postId, history, callback) =>
	catchAsync("post", async (dispatch) => {
		dispatch(resetAlert()); //Need to be in every action with alert
		const jsonContentState = JSON.stringify(contentState);
		const config = {
			headers: {
				"Content-type": "application/json",
			},
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
				totalPages,
			},
		}); // loads whilst posting comment

		// Redirect to last page when sending comment
		history.push(`/discussion/post/${postId}?page=${totalPages}`);
		callback(totalPages);
	});

export const deleteComment = (postId, commentId, history, page, callback) =>
	catchAsync("post", async (dispatch) => {
		dispatch(resetAlert()); //Need to be in every action with alert
		const res = await axios.put(`/api/posts/${postId}/comments/${commentId}`);

		const comments = res.data;
		const totalPages = Math.ceil(comments.length / 6) || 1; // pagelimit = 10
		dispatch({
			type: DELETE_COMMENT,
			payload: {
				comments,
				totalPages,
			},
		});
		if (page > totalPages) {
			history.push(`/discussion/post/${postId}?page=${totalPages}`);
			callback(totalPages);
		}
		dispatch(setAlert("Comment removed", "success"));
	});

export const searchPost = (text, page = 1) =>
	catchAsync("post", async (dispatch) => {
		dispatch(resetAlert()); //Need to be in every action with alert
		dispatch({ type: POST_RESET });
		const config = {
			headers: {
				"Content-type": "application/json",
			},
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
				limit,
			},
		});
	});
