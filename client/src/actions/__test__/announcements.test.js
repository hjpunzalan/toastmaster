// integration test that test both action and reducer
import moxios from "moxios";
import { storeFactory } from "../../utils/testUtils";
import { toggleEdit, createAnnouncement } from "../announcements";

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

	test("should create announcement and reset alert", () => {
		const store = storeFactory();
		// Set announcement data to be passed
		const announcement = {
			title: "test",
			contentState: "contentstate",
			plaintText: "hello",
		};

		moxios.wait(() => {
			// Define how moxios respond from axios
			const request = moxios.requests.mostRecent();
			request.respondWith({
				status: 200,
				response: announcement,
			});
		});

		// Dispatch create announcement action
		store
			.dispatch(
				createAnnouncement({
					title: announcement.title,
					contentState: announcement.contentState,
					plainText: announcement.plainText,
				})
			)
			.then(() => {
				// Assert announcement creation
				const { announcements, alerts } = store.getState();
				expect(announcements.announcements[0]).toEqual(announcement);

				// Alert sent to user
				expect(alerts.msg.length).toEqual(1);
				expect(alerts.alertType).toBe("success");
			});
	});
});
