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
	const store = storeFactory();
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
});
