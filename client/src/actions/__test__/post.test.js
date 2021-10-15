import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { createBrowserHistory } from "history";
import { storeFactory } from "../../utils/testUtils";
import { setAlert } from "../alerts";
import {
	toggleCreatePost,
	toggleEditPost,
	createPost,
	postLimitPerPage,
	getAllPost,
	postNextPage,
	getPost,
	updatePost,
	deletePost,
	addComment,
	deleteComment,
	searchPost,
} from "../post";
import { initialState } from "../../reducers/post";

describe("POST request patterns", () => {
	const testPost = {
		_id: "postid",
		user: "test",
		title: "title",
		contentState: {},
		plainText: "text",
		comments: [{ id: "test", plainText: "test" }],
	};
	test("should toggle create post", () => {
		const store = storeFactory();
		// Test reset alert
		const msg = "test";
		const alertType = "fail";
		store.dispatch(setAlert(msg, alertType));

		store.dispatch(toggleCreatePost());
		const { post, alerts } = store.getState();
		// Assert postEdit state is toggled
		expect(post.edit).not.toEqual(initialState.edit);
		// Assert reset alert works
		expect(alerts.msg.length).toEqual(0);
	});

	test("should toggle edit post", () => {
		const store = storeFactory();
		// Test reset alert
		const msg = "test";
		const alertType = "fail";
		store.dispatch(setAlert(msg, alertType));

		store.dispatch(toggleEditPost());
		const { post, alerts } = store.getState();
		// Assert postEdit state is toggled
		expect(post.postEdit).not.toEqual(initialState.postEdit);
		// Assert reset alert works
		expect(alerts.msg.length).toEqual(0);
	});

	test("should create post", async () => {
		const store = storeFactory();

		const mock = new MockAdapter(axios);

		// Mock axios request for creating post
		mock.onPost("/api/posts").reply(201, testPost);
		// Test reset alert
		const msg = "test";
		const alertType = "fail";
		store.dispatch(setAlert(msg, alertType));

		// Spy mock on history
		const history = createBrowserHistory();
		jest.spyOn(history, "push");

		await store.dispatch(
			createPost({
				title: testPost.title,
				contentState: testPost.contentState,
				history,
				plainText: testPost.plainText,
			})
		);
		const { post, alerts } = store.getState();
		// Assert posts list updated
		expect(post.posts.length).toEqual(1);
		// Assert edit and loading
		expect(post.edit).toEqual(initialState.edit);
		expect(post.postLoading).not.toEqual(initialState.postLoading);
		// Assert reset alert works
		expect(alerts.msg.length).toEqual(0);

		// Assert history redirection
		expect(history.push).toHaveBeenCalledWith(
			`/discussion/post/${testPost._id}`
		);
	});

	test("should get all posts", async () => {
		const store = storeFactory();
		const page = 1;

		const mock = new MockAdapter(axios);

		// Mock axios request for login and logout
		mock
			.onGet(
				`/api/posts?page=${page}&limit=${postLimitPerPage}&sort=-lastEdited,-lastComment`
			)
			.reply(200, {
				posts: [testPost],
				numPosts: 1,
			});
		// Test reset alert
		const msg = "test";
		const alertType = "fail";
		store.dispatch(setAlert(msg, alertType));

		// Spy mock on history
		const history = createBrowserHistory();
		jest.spyOn(history, "push");

		await store.dispatch(getAllPost(page));
		const { post, alerts } = store.getState();
		// Assert posts list updated
		expect(post.posts.length).toEqual(1);
		// Assert edit and loading
		expect(post.postEdit).toEqual(initialState.postEdit);
		expect(post.loading).not.toEqual(initialState.loading);
		// Assert total pages
		expect(post.totalPages).toEqual(1);
		// Assert reset alert works
		expect(alerts.msg.length).toEqual(0);
	});

	test("should get next page with search", async () => {
		const store = storeFactory();
		const page = 1;

		const mock = new MockAdapter(axios);

		// Mock axios request get post list next page
		mock
			.onPost(
				`/api/posts/search/text?page=${
					page + 1
				}&limit=${postLimitPerPage}&sort=-lastEdited,-lastComment`
			)
			.reply(200, {
				posts: [testPost],
				numPosts: 1,
			})
		
		const mockSetPage = jest.fn();
		// Dispatch action
		await store.dispatch(postNextPage(page, mockSetPage, "test"));

		const { post } = store.getState();
		// Assert posts list updated
		expect(post.posts.length).toEqual(1);
		expect(post.posts[0]).toEqual(testPost)
		// Assert edit and loading
		expect(post.postEdit).toEqual(false);
		expect(post.loading).toEqual(false);

	});

	test('should get next page without search', async () => {
const store = storeFactory();
		const page = 1;
		const mock = new MockAdapter(axios);

		// Mock axios request get post list next page
		mock
			.onGet(
				`/api/posts?page=${
					page + 1
				}&limit=${postLimitPerPage}&sort=-lastEdited,-lastComment`)
			.reply(200, {
				posts: [testPost],
				numPosts: 1
			});

		const mockSetPage = jest.fn();


			// Test without search //
		await store.dispatch(postNextPage(page, mockSetPage));

		const {post} = store.getState();
		// Assert posts list updated
		expect(post.posts.length).toEqual(1);
		expect(post.posts[0]).toEqual(testPost)
		// Assert edit and loading
		expect(post.postEdit).toEqual(false);
		expect(post.loading).toEqual(false);

	})
	

	test("should get post by id", async () => {
		const store = storeFactory();

		const mock = new MockAdapter(axios);

		// Mock axios request for get post by id
		mock.onGet(`/api/posts/${testPost._id}`).reply(200, testPost);

		// Mock props
		const currentPage = 1;
		const mockSetPage = jest.fn();
		// Spy mock on history
		const history = createBrowserHistory();
		jest.spyOn(history, "push");

		// Dispatch action
		await store.dispatch(
			getPost({ id: testPost._id, currentPage, history, setPage: mockSetPage })
		);

		const { post } = store.getState();
		// Assert edit
		expect(post.edit).toEqual(false);
		// Assert post edit and loading
		expect(post.postEdit).toEqual(false);
		expect(post.postLoading).toEqual(false);
		// Assert post total pages
		expect(post.post).toEqual({ ...testPost, totalPages: 1 });
		// Assert redirection
		expect(history.push).not.toHaveBeenCalledWith(
			`/discussion/post/${testPost._id}`
		);

		// Test with current page higher than total pages or NaN
		await store.dispatch(
			getPost({
				id: testPost._id,
				currentPage: 99,
				history,
				setPage: mockSetPage,
			})
		);
		// Assert redirection
		expect(history.push).toHaveBeenCalledWith(
			`/discussion/post/${testPost._id}`
		);
		// Assert setPage
		expect(mockSetPage).toHaveBeenCalledWith(1);
	});

	test("should update post", async () => {
		const store = storeFactory();

		const mock = new MockAdapter(axios);

		const updatedPost = {
			...testPost,
			title: "update",
			plainText: "new things",
		};

		// Mock axios request for update post
		mock.onPatch(`/api/posts/${testPost._id}`).reply(200, updatedPost);

		// Test reset alert
		const msg = "test";
		const alertType = "fail";
		store.dispatch(setAlert(msg, alertType));

		// Dispatch action
		await store.dispatch(
			updatePost({
				postId: testPost._id,
				newTitle: updatedPost.title,
				newContentState: updatedPost.contentState,
				plainText: updatedPost.plainText,
			})
		);

		const { post, alerts } = store.getState();
		// Assert post edit and loading
		expect(post.postEdit).toEqual(false);
		expect(post.postLoading).toEqual(false);
		// Assert post
		expect(post.post).toEqual({ ...updatedPost });
		// Assert reset alert works
		expect(alerts.msg.length).toEqual(0);
	});

	test("should delete post", async () => {
		// Mock window confirm click
		window.confirm = jest.fn(() => true);

		const store = storeFactory();
		const mock = new MockAdapter(axios);

		// Mock axios request for delete post
		mock.onDelete(`/api/posts/${testPost._id}`).reply(204);

		// Spy mock on history
		const history = createBrowserHistory();
		jest.spyOn(history, "push");

		// Dispatch action
		await store.dispatch(deletePost(testPost._id, history));

		const { post, alerts } = store.getState();
		// Assert post loading
		expect(post.postLoading).toEqual(true);
		expect(post.loading).toEqual(true);
		// Assert post
		expect(post.post).toEqual(null);

		// Assert redirection
		expect(history.push).toHaveBeenCalledWith("/discussion");
		// Assert alert
		expect(alerts.alertType).toEqual("success");
	});

	test("should add comment", async () => {
		const store = storeFactory();
		const mock = new MockAdapter(axios);

		// Mock axios request for add comment to post
		mock.onPost(`/api/posts/${testPost._id}`).reply(200, testPost.comments);

		// Test reset alert
		const msg = "test";
		const alertType = "fail";
		store.dispatch(setAlert(msg, alertType));

		// Mock props
		const mockSetPage = jest.fn();
		const totalPages = 1;
		// Spy mock on history
		const history = createBrowserHistory();
		jest.spyOn(history, "push");

		// Dispatch action
		await store.dispatch(
			addComment({
				contentState: testPost.contentState,
				postId: testPost._id,
				history,
				setPage: mockSetPage,
			})
		);

		const { post, alerts } = store.getState();
		// Assert reset alert works
		expect(alerts.msg.length).toEqual(0);
		// Assert post loading
		expect(post.postLoading).toEqual(false);
		// Assert post
		expect(post.post).toEqual({ comments: testPost.comments, totalPages });

		// Assert redirection
		expect(history.push).toHaveBeenCalledWith(
			`/discussion/post/${testPost._id}?page=${totalPages}`
		);
		// Assert setPage
		expect(mockSetPage).toHaveBeenCalledWith(totalPages);
	});
	test("should delete comment", async () => {
		const store = storeFactory();
		const mock = new MockAdapter(axios);

		// Mock axios request for add comment to post
		mock
			.onPut(`/api/posts/${testPost._id}/comments/${testPost.comments[0].id}`)
			.reply(200, testPost.comments);

		// Test reset alert
		const msg = "test";
		const alertType = "fail";
		store.dispatch(setAlert(msg, alertType));

		// Mock props
		const mockSetPage = jest.fn();
		const page = 1;
		const totalPages = 1;
		// Spy mock on history
		const history = createBrowserHistory();
		jest.spyOn(history, "push");

		// Dispatch action
		await store.dispatch(
			deleteComment({
				postId: testPost._id,
				commentId: testPost.comments[0].id,
				history,
				page,
				setPage: mockSetPage,
			})
		);

		const { post, alerts } = store.getState();
		// Assert reset and send alert works
		expect(alerts.msg.length).toEqual(1);
		expect(alerts.alertType).toEqual("success");
		// Assert post loading
		expect(post.postLoading).toEqual(false);
		// Assert post
		expect(post.post).toEqual({ comments: testPost.comments, totalPages });

		/////// Assert redirection when page > total pages ///////////
		// Dispatch action
		await store.dispatch(
			deleteComment({
				postId: testPost._id,
				commentId: testPost.comments[0].id,
				history,
				page: 999,
				setPage: mockSetPage,
			})
		);
		expect(history.push).toHaveBeenCalledWith(
			`/discussion/post/${testPost._id}?page=${totalPages}`
		);
		// Assert setPage
		expect(mockSetPage).toHaveBeenCalledWith(totalPages);
	});

	test("should search post", async () => {
		const store = storeFactory();
		const mock = new MockAdapter(axios);
		const page = 1;

		// Mock axios request for add comment to post
		mock
			.onPost(
				`/api/posts/search/text?page=${page}&limit=${postLimitPerPage}&sort=-lastComment,-date`
			)
			.reply(200, { posts: [testPost], numPosts: 1 });

		// Test reset alert
		const msg = "test";
		const alertType = "fail";
		store.dispatch(setAlert(msg, alertType));

		// Dispatch action
		await store.dispatch(searchPost("test"));

		const { post, alerts } = store.getState();
		// Assert reset and send alert works
		expect(alerts.msg.length).toEqual(0);
		// Assert post loading and edit
		expect(post.loading).toEqual(false);
		expect(post.postEdit).toEqual(false);
		// Assert post
		expect(post.post).toEqual(null);
		// Assert total pages
		expect(post.totalPages).toEqual(1);
	});
});
