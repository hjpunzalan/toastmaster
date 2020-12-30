// integration test that test both action and reducer
import moxios from "moxios";
import { storeFactory } from "../../utils/testUtils";
import {
	toggleEdit,
	createAnnouncement,
	updateAnnouncement,
	getAnnouncements,
	deleteAnnouncement,
} from "../announcements";
import { setAlert } from "../alerts";
import { initialState } from "../../reducers/announcements";

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
		_id: "test",
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

		moxios.wait(() => {
			// Define how moxios respond from axios
			const request = moxios.requests.mostRecent();
			request.respondWith({
				status: 200,
				response: [announcement],
			});
		});

		// Dispatch create announcement action
		await store.dispatch(getAnnouncements());
		// Assert announcement creation
		const { announcements } = store.getState();
		expect(announcements.loading).toBe(false);
		expect(announcements.announcements[0]).toEqual(announcement);
	});

	test("should update announcements and reset alerts", async () => {
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

		// Updated announcement
		const newAnnouncement = {
			title: "test2",
			contentState: { test: "test2" },
			plainText: "test2",
		};

		moxios.wait(() => {
			// Define how moxios respond from axios
			const request = moxios.requests.mostRecent();
			request.respondWith({
				status: 200,
				// Update previous announcement
				response: { ...announcement, ...newAnnouncement },
			});
		});
		// Dispatch updateAnnouncement action
		await store.dispatch(
			updateAnnouncement({
				_id: announcement.id,
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

		moxios.wait(() => {
			// Define how moxios respond from axios
			const request = moxios.requests.mostRecent();
			request.respondWith({
				// Delete announcement response
				status: 204,
				response: announcement,
			});
		});
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

	describe("should send announcement error when request fails", () => {
		const store = storeFactory();
		const error = {
			statusText: "fail",
			status: 401,
		};

		test("should send error when creating announcements", async () => {
			moxios.wait(() => {
				// Define how moxios respond from axios
				const request = moxios.requests.mostRecent();
				request.reject({
					status: 401,
					response: error,
				});
			});

			await store.dispatch(
				createAnnouncement({
					title: announcement.title,
					contentState: announcement.contentState,
					plainText: announcement.plainText,
				})
			);

			// GET CURRENT STATE
			const { announcements, alerts } = store.getState();
			// Assert announcement loading
			expect(announcements.loading).toBe(false);
			// Assert announcement error
			expect(announcements).toEqual({ ...initialState, loading: false });
			// Alert sent to user
			expect(alerts.error.msg).toEqual("fail");
		});

		test("should send error when getting announcements", async () => {
			moxios.wait(() => {
				// Define how moxios respond from axios
				const request = moxios.requests.mostRecent();
				request.reject({
					status: 401,
					response: error,
				});
			});
			await store.dispatch(getAnnouncements());
			// GET CURRENT STATE
			const { announcements, alerts } = store.getState();
			// Assert announcement loading
			expect(announcements.loading).toBe(false);
			// Assert announcement error
			expect(announcements).toEqual({ ...initialState, loading: false });
			// Alert sent to user
			expect(alerts.error.msg).toEqual("fail");
		});
		test("should send error when updating announcements", async () => {
			moxios.wait(() => {
				// Define how moxios respond from axios
				const request = moxios.requests.mostRecent();
				request.reject({
					status: 401,
					response: error,
				});
			});

			await store.dispatch(
				updateAnnouncement({
					_id: "test",
				})
			);

			// GET CURRENT STATE
			const { announcements, alerts } = store.getState();
			// Assert announcement loading
			expect(announcements.loading).toBe(false);
			// Assert announcement error
			expect(announcements).toEqual({ ...initialState, loading: false });
			// Alert sent to user
			expect(alerts.error.msg).toEqual("fail");
		});
		test("should send error when deleting announcements", async () => {
			moxios.wait(() => {
				// Define how moxios respond from axios
				const request = moxios.requests.mostRecent();
				request.reject({
					status: 401,
					response: error,
				});
			});

			await store.dispatch(
				updateAnnouncement({
					_id: "test",
				})
			);

			// GET CURRENT STATE
			const { announcements, alerts } = store.getState();
			// Assert announcement loading
			expect(announcements.loading).toBe(false);
			// Assert announcement error
			expect(announcements).toEqual({ ...initialState, loading: false });
			// Alert sent to user
			expect(alerts.error.msg).toEqual("fail");
		});
	});
});
