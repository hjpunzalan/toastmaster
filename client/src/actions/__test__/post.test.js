import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { createBrowserHistory } from "history";
import { storeFactory } from "../../utils/testUtils";
import { setAlert } from "../alerts";
import { toggleCreatePost, toggleEditPost, createPost } from "../post";
import { initialState } from "../../reducers/post";

describe("POST request patterns", () => {
	const testPost = {
		_id: "postid",
		user: "test",
		title: "title",
		contentState: {},
		plainText: "text",
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

		// Mock axios request for login and logout
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
});
