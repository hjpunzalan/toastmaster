import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { storeFactory } from "../../../utils/testUtils";
import {
	toggleEdit,
	createAnnouncement,
	updateAnnouncement,
	getAnnouncements,
	deleteAnnouncement,
	limit,
} from "../../announcements";
import { setAlert } from "../../alerts";
import { initialState } from "../../../reducers/announcements";

describe("should send announcement error when request fails", () => {
	const store = storeFactory();
	const error = {
		statusText: "fail",
		status: 401,
		message: "fail message",
	};

	// Set announcement data to be passed
	const announcement = {
		_id: "test",
		title: "test",
		contentState: "contentstate",
		plaintText: "hello",
	};

	test("should send error when creating announcements", async () => {
		const mock = new MockAdapter(axios);
		mock
			.onPost("/api/announcements")
			.reply(401, error)
			.onGet("/api/auth/logout")
			.reply(200);

		await store.dispatch(
			createAnnouncement({
				title: announcement.title,
				contentState: announcement.contentState,
				plainText: announcement.plainText,
			})
		);

		// GET CURRENT STATE
		const { announcements, alerts } = store.getState();
		// Assert announcement error
		expect(announcements).toEqual({ ...initialState, loading: false });
		// Alert sent to user
		expect(alerts.alertType).toEqual("fail");
	});

	test("should send error when getting announcements", async () => {
		const mock = new MockAdapter(axios);
		mock
			.onGet("/api/announcements")
			.reply(401, error)
			.onGet("/api/auth/logout")
			.reply(200);
		await store.dispatch(getAnnouncements());
		// GET CURRENT STATE
		const { announcements, alerts } = store.getState();
		// Assert announcement error
		expect(announcements).toEqual({ ...initialState, loading: false });
		// Alert sent to user
		expect(alerts.alertType).toEqual("fail");
	});
	test("should send error when updating announcements", async () => {
		const mock = new MockAdapter(axios);
		mock
			.onPatch(`/api/announcements/${announcement._id}`)
			.reply(401, error)
			.onGet("/api/auth/logout")
			.reply(200);

		await store.dispatch(
			updateAnnouncement({
				_id: "test",
			})
		);

		// GET CURRENT STATE
		const { announcements, alerts } = store.getState();
		// Assert announcement error
		expect(announcements).toEqual({ ...initialState, loading: false });
		// Alert sent to user
		expect(alerts.alertType).toEqual("fail");
	});
	test("should send error when deleting announcements", async () => {
		const mock = new MockAdapter(axios);
		mock
			.onDelete(`/api/announcements/${announcement._id}`)
			.reply(401, error)
			.onGet("/api/auth/logout")
			.reply(200);

		await store.dispatch(
			updateAnnouncement({
				_id: "test",
			})
		);

		// GET CURRENT STATE
		const { announcements, alerts } = store.getState();
		// Assert announcement error
		expect(announcements).toEqual({ ...initialState, loading: false });
		// Alert sent to user
		expect(alerts.alertType).toEqual("fail");
	});
});
