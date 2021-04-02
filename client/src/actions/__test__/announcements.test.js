// integration test that test both action and reducer
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { storeFactory } from "../../utils/testUtils";
import {
	toggleEdit,
	createAnnouncement,
	updateAnnouncement,
	getAnnouncements,
	deleteAnnouncement,
	limit,
} from "../announcements";
import { setAlert } from "../alerts";

test("should toggle edit and reset alert", () => {
	const store = storeFactory();

	store.dispatch(toggleEdit());

	const { announcements, alerts } = store.getState();
	// alert state should reset
	expect(alerts.msg.length).toBe(0);
	// Initial edit property should be false
	expect(announcements.edit).toBe(true);
});

describe("Announcement CRUD operations", () => {
	// Set announcement data to be passed
	const announcement = {
		_id: "test",
		title: "test",
		contentState: "contentstate",
		plaintText: "hello",
	};

	test("should create announcement and reset alert", async () => {
		const store = storeFactory();
		const mock = new MockAdapter(axios);
		mock.onPost("/api/announcements").reply(201, announcement);

		// Test reset alert
		const msg = "test";
		const alertType = "fail";
		store.dispatch(setAlert(msg, alertType));

		// Dispatch create announcement action
		await store.dispatch(
			createAnnouncement({
				title: announcement.title,
				contentState: announcement.contentState,
				plainText: announcement.plainText,
			})
		);
		// Assert announcement creation
		const { announcements, alerts } = store.getState();
		expect(announcements.loading).toBe(false);
		expect(announcements.announcements[0]).toEqual(announcement);

		// Alert sent to user
		expect(alerts.msg.length).toEqual(1);
		expect(alerts.alertType).toBe("success");
	});

	test("should get announcements", async () => {
		const store = storeFactory();
		const mock = new MockAdapter(axios);
		mock
			.onGet(`/api/announcements?sort=-lastEdited&limit=${limit}`)
			.reply(200, [announcement]);

		// Dispatch create announcement action
		await store.dispatch(getAnnouncements());
		// Assert announcement creation
		const { announcements } = store.getState();
		expect(announcements.loading).toBe(false);
		expect(announcements.announcements[0]).toEqual(announcement);
	});

	test("should update announcements and reset alerts", async () => {
		// Updated announcement
		const newAnnouncement = {
			title: "test2",
			contentState: { test: "test2" },
			plainText: "test2",
		};

		const store = storeFactory();
		const mock = new MockAdapter(axios);
		mock
			.onPost("/api/announcements")
			.reply(201, announcement)
			.onPatch(`/api/announcements/${announcement._id}`)
			.reply(200, { _id: announcement._id, ...newAnnouncement });

		// Test reset alert
		const msg = "test";
		const alertType = "fail";
		store.dispatch(setAlert(msg, alertType));

		// Dispatch create announcement action
		await store.dispatch(
			createAnnouncement({
				title: announcement.title,
				contentState: announcement.contentState,
				plainText: announcement.plainText,
			})
		);

		// Dispatch updateAnnouncement action
		await store.dispatch(
			updateAnnouncement({
				id: announcement._id,
				newTitle: newAnnouncement.title,
				newContentState: newAnnouncement.contentState,
				plainText: newAnnouncement.plainText,
			})
		);

		// Assert announcement update
		const { announcements, alerts } = store.getState();
		expect(announcements.loading).toBe(false);
		expect(announcements.announcements[0].title).toEqual(newAnnouncement.title);
		expect(announcements.announcements[0].contentState).toEqual(
			newAnnouncement.contentState
		);
		expect(announcements.announcements[0].plainText).toEqual(
			newAnnouncement.plainText
		);

		// // Alert sent to user
		expect(alerts.msg.length).toEqual(1);
		expect(alerts.alertType).toBe("success");
	});

	test("should delete announcement", async () => {
		window.confirm = jest.fn(() => true);

		const store = storeFactory();
		const mock = new MockAdapter(axios);
		mock
			.onPost("/api/announcements")
			.reply(201, announcement)
			.onDelete(`/api/announcements/${announcement._id}`)
			.reply(200, announcement);

		// Test reset alert
		const msg = "test";
		const alertType = "fail";
		store.dispatch(setAlert(msg, alertType));

		// Dispatch create announcement action
		await store.dispatch(
			createAnnouncement({
				title: announcement.title,
				contentState: announcement.contentState,
				plainText: announcement.plainText,
			})
		);

		// Dispatch deleteAnnnouncement action
		await store.dispatch(deleteAnnouncement(announcement._id));

		// Assert announcement deletion
		const { announcements, alerts } = store.getState();
		expect(announcements.loading).toBe(false);
		expect(announcements.announcements.length).toEqual(0);

		// // Alert sent to user
		expect(alerts.msg.length).toEqual(1);
		expect(alerts.alertType).toBe("success");
	});
});
