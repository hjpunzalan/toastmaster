// integration test that test both action and reducer
import moxios from "moxios";
import { storeFactory } from "../../utils/testUtils";
import {
	toggleEdit,
	createAnnouncement,
	getAnnouncements,
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
	// Insert a specific axios instance
	beforeEach(() => {
		moxios.install();
	});
	afterEach(() => {
		moxios.uninstall();
	});

	// Set announcement data to be passed
	const announcement = {
		title: "test",
		contentState: "contentstate",
		plaintText: "hello",
	};

	test("should create announcement and reset alert", async () => {
		const store = storeFactory();

		moxios.wait(() => {
			// Define how moxios respond from axios
			const request = moxios.requests.mostRecent();
			request.respondWith({
				status: 200,
				response: announcement,
			});
		});

		// Test reset alert
		const msg = "test";
		const alertType = "success";
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
		expect(announcements.announcements[0]).toEqual(announcement);

		// Alert sent to user
		expect(alerts.msg.length).toEqual(1);
		expect(alerts.alertType).toBe("success");
	});

	test("should get announcements", () => {
		const store = storeFactory();

		moxios.wait(() => {
			// Define how moxios respond from axios
			const request = moxios.requests.mostRecent();
			request.respondWith({
				status: 200,
				response: [announcement],
			});
		});

		// Dispatch create announcement action
		store.dispatch(getAnnouncements()).then(() => {
			// Assert announcement creation
			const { announcements } = store.getState();
			expect(announcements.announcements[0]).toEqual(announcement);
		});
	});

	test("should update announcements and reset alerts", () => {
		const store = storeFactory();

		moxios.wait(() => {
			// Define how moxios respond from axios
			const request = moxios.requests.mostRecent();
			request.respondWith({
				status: 200,
				response: [announcement],
			});
		});

		// Dispatch create announcement action
		store.dispatch(getAnnouncements()).then(() => {
			// Assert announcement creation
			const { announcements } = store.getState();
			expect(announcements.announcements[0]).toEqual(announcement);
		});
	});
});
