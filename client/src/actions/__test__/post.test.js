import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { createBrowserHistory } from "history";
import { storeFactory } from "../../utils/testUtils";
import { setAlert } from "../alerts";
import { toggleCreatePost } from "../post";
import { initialState } from "../../reducers/post";

describe("POST request patterns", () => {
	const post = {
		user: "test",
		title: "title",
		contentState: {},
		plainText: "text",
	};

	test("should toggle create post", async () => {
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
});
