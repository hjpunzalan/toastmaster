import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { createBrowserHistory } from "history";
import { storeFactory } from "../../../utils/testUtils";
import { setAlert } from "../../alerts";
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
} from "../../post";
import { initialState } from "../../../reducers/post";

describe("Test for error handling post actions", () => {
	const error = {
		statusText: "fail",
		status: 401,
		message: "fail message",
	};

	const testPost = {
		_id: "postid",
		user: "test",
		title: "title",
		contentState: {},
		plainText: "text",
		comments: [{ id: "test", plainText: "test" }],
	};
	test("should send error when creating post", async () => {
		const store = storeFactory();
		const mock = new MockAdapter(axios);
		mock.onPost("/api/posts").reply(400, error);

		// Test reset alert
		const msg = "test";
		const alertType = "success";
		store.dispatch(setAlert(msg, alertType));

		await store.dispatch(
			createPost({
				title: testPost.title,
				contentState: testPost.contentState,
				history,
				plainText: testPost.plainText,
			})
		);
		const { post, alerts } = store.getState();
		// Assert loading
		expect(post.loading).toEqual(false);
		expect(post.postLoading).toEqual(false);
		// Alert sent to user
		expect(alerts.alertType).toEqual("fail");
		// Reset alert
		expect(alerts.msg.length).toEqual(1);
	});
	test("should send error when getting all post", async () => {
		const store = storeFactory();
		const mock = new MockAdapter(axios);
		const page = 1;
		mock
			.onGet(
				`/api/posts?page=${page}&limit=${postLimitPerPage}&sort=,-lastEdited,-lastComment`
			)
			.reply(400, error);

		// Test reset alert
		const msg = "test";
		const alertType = "success";
		store.dispatch(setAlert(msg, alertType));

		await store.dispatch(getAllPost(page));
		const { post, alerts } = store.getState();
		// Assert loading
		expect(post.loading).toEqual(false);
		expect(post.postLoading).toEqual(false);
		// Alert sent to user
		expect(alerts.alertType).toEqual("fail");
		// Reset alert
		expect(alerts.msg.length).toEqual(1);
	});
	test("should send error at post next page", async () => {
		const store = storeFactory();
		const mock = new MockAdapter(axios);
		const page = 1;
		mock
			.onPost(
				`/api/posts/search/text?page=${
					page + 1
				}&limit=${postLimitPerPage}&sort=-lastComment,-date`
			)
			.reply(400, error)
			.onGet(
				`/api/posts?page=${
					page + 1
				}&limit=${postLimitPerPage}&sort=-lastComment,-date`
			)
			.reply(400, error);

		const mockSetPage = jest.fn();
		// Dispatch action
		await store.dispatch(postNextPage(page, mockSetPage, "test"));

		const { post, alerts } = store.getState();
		// Assert loading
		expect(post.loading).toEqual(false);
		expect(post.postLoading).toEqual(false);
		// Alert sent to user
		expect(alerts.alertType).toEqual("fail");
		// Reset alert
		expect(alerts.msg.length).toEqual(1);

		// Test without search //
		await store.dispatch(postNextPage(page, mockSetPage));

		const newState = store.getState();
		// Assert edit and loading
		expect(newState.post.postLoading).toEqual(false);
		expect(newState.post.loading).toEqual(false);
		// Alert sent to user
		expect(newState.alerts.alertType).toEqual("fail");
		// Alert msg must be 2
		expect(newState.alerts.msg.length).toEqual(2);
	});
	test("should send error when getting a post", async () => {
		const store = storeFactory();
		const mock = new MockAdapter(axios);
		const page = 1;
		mock.onGet(`/api/posts/${testPost._id}`).reply(400, error);

		await store.dispatch(getAllPost(page));
		const { post, alerts } = store.getState();
		// Assert loading
		expect(post.loading).toEqual(false);
		expect(post.postLoading).toEqual(false);
		// Alert sent to user
		expect(alerts.alertType).toEqual("fail");
	});
});
