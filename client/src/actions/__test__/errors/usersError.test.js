import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { createBrowserHistory } from "history";
import { storeFactory } from "../../../utils/testUtils";
import { setAlert } from "../../alerts";
import {
	registerUser,
	updateMe,
	getAllUsers,
	toggleView,
	deActivateUser,
	activateUser,
	changeRole,
} from "../../users";

describe("USER request patterns", () => {
	const error = {
		statusText: "fail",
		status: 401,
		message: "fail message",
	};

	const testUser = {
		_id: "test",
		firstName: "test",
		lastName: "testLastName",
		email: "test@example.com",
		password: "testing",
		role: "user",
	};

	const registerTestUser = async (mock, store) => {
		// Mock axios request
		mock.onPost("/api/users/register").reply(200, {
			_id: testUser._id,
			email: testUser.email,
		});

		// Dispatch register action
		await store.dispatch(
			registerUser({
				formData: {
					email: testUser.email,
					firstName: testUser.firstName,
					lastName: testUser.lastName,
				},
				url: "testUrl",
			})
		);
	};

	test("should send error when registering user", async () => {
		const store = storeFactory();
		const mock = new MockAdapter(axios);

		// Test reset alert
		const msg = "test";
		const alertType = "success";
		store.dispatch(setAlert(msg, alertType));

		// Mock register request and dispatch action
		// Mock axios request
		mock.onPost("/api/users/register").reply(400, error);

		// Dispatch register action
		await store.dispatch(
			registerUser(
				{
					email: testUser.email,
					firstName: testUser.firstName,
					lastName: testUser.lastName,
				},
				"testUrl"
			)
		);

		const { users, alerts } = store.getState();
		// Assert loading
		expect(users.loading).toEqual(false);
		// Alert sent to user
		expect(alerts.alertType).toEqual("fail");
		// Reset alert
		expect(alerts.msg.length).toEqual(1);
	});

	test("should send error when updating user", async () => {
		const store = storeFactory();
		const mock = new MockAdapter(axios);

		// Test reset alert
		const msg = "test";
		const alertType = "success";
		store.dispatch(setAlert(msg, alertType));

		// props
		const url = "testUrl";
		const file = { file: "data" };

		// Spy mock on history
		const history = createBrowserHistory();
		jest.spyOn(history, "push");

		// Mock register request and dispatch action
		// Mock axios request
		mock
			.onPost("/api/upload")
			.reply(400, error)
			.onPut(url)
			.reply(400)
			.onPatch("/api/users/updateMe")
			.reply(400, error);

		// Dispatch action with file
		await store.dispatch(updateMe(testUser, file, history));

		const { auth, alerts } = store.getState();
		// Assert loading
		expect(auth.loading).toEqual(false);
		// Alert sent to user
		expect(alerts.alertType).toEqual("fail");
		// Reset alert
		expect(alerts.msg.length).toEqual(1);
		// Assert history redirection
		expect(history.push).not.toHaveBeenCalled();

		// Dispatch action without file
		await store.dispatch(updateMe(testUser, null, history));

		const newState = store.getState();
		// Assert loading
		expect(newState.auth.loading).toEqual(false);
		// Alert sent to user
		expect(newState.alerts.alertType).toEqual("fail");
		// Reset alert
		expect(newState.alerts.msg.length).toEqual(1);
		// Assert history redirection
		expect(history.push).not.toHaveBeenCalled();
	});

	test("should send error when getting all users", async () => {
		const store = storeFactory();
		const mock = new MockAdapter(axios);

		// Mock register request and dispatch action
		// Mock axios request
		mock.onGet("/api/users?sort=firstName").reply(400, error);

		// Dispatch action
		await store.dispatch(getAllUsers());

		const { users, alerts } = store.getState();
		// Assert loading
		expect(users.loading).toEqual(false);
		// Alert sent to user
		expect(alerts.alertType).toEqual("fail");
		// Reset alert
		expect(alerts.msg.length).toEqual(1);
	});
	test("should send error when deactivating a user", async () => {
		const store = storeFactory();
		const mock = new MockAdapter(axios);

		// Mock register request and dispatch action
		// Mock axios request
		mock.onPatch(`/api/users/deActivateUser/${testUser._id}`).reply(400, error);

		// Test reset alert
		const msg = "test";
		const alertType = "success";
		store.dispatch(setAlert(msg, alertType));

		// Register user first
		// Mock register request and dispatch action
		await registerTestUser(mock, store);

		// Dispatch  action
		await store.dispatch(deActivateUser(testUser._id));

		const { users, alerts } = store.getState();
		// Assert loading
		expect(users.loading).toEqual(false);
		// Alert sent to user
		expect(alerts.alertType).toEqual("fail");
		// Reset alert
		expect(alerts.msg.length).toEqual(1);
	});

	test("should send error when reactivating a user", async () => {
		const store = storeFactory();
		const mock = new MockAdapter(axios);

		// Mock register request and dispatch action
		// Mock axios request
		mock.onPatch(`/api/users/activateUser/${testUser._id}`).reply(400, error);

		// Test reset alert
		const msg = "test";
		const alertType = "success";
		store.dispatch(setAlert(msg, alertType));

		// Register user first
		// Mock register request and dispatch action
		await registerTestUser(mock, store);

		// Dispatch  action
		await store.dispatch(activateUser(testUser._id));

		const { users, alerts } = store.getState();
		// Assert loading
		expect(users.loading).toEqual(false);
		// Alert sent to user
		expect(alerts.alertType).toEqual("fail");
		// Reset alert
		expect(alerts.msg.length).toEqual(1);
	});
	test("should send error when changing a user role", async () => {
		const store = storeFactory();
		const mock = new MockAdapter(axios);

		// Mock register request and dispatch action
		// Mock axios request
		// Mock axios request
		mock
			.onPatch(`/api/users/makeCommittee/${testUser._id}`)
			.reply(400, error)
			.onPatch(`/api/users/removeCommittee/${testUser._id}`)
			.reply(400, error);
		// Test reset alert
		const msg = "test";
		const alertType = "success";
		store.dispatch(setAlert(msg, alertType));

		// Register user first
		// Mock register request and dispatch action
		await registerTestUser(mock, store);

		// Dispatch  action change role to committee
		await store.dispatch(changeRole(testUser._id, "true"));

		const { users, alerts } = store.getState();
		// Assert loading
		expect(users.loading).toEqual(false);
		// Alert sent to user
		expect(alerts.alertType).toEqual("fail");
		// Reset alert
		expect(alerts.msg.length).toEqual(1);

		//////////////////

		// Dispatch  action change role demote to user
		await store.dispatch(changeRole(testUser._id, "false"));

		const newState = store.getState();

		// Assert user role
		expect(newState.users.loading).toEqual(false);

		// Assert reset alert works
		expect(newState.alerts.msg.length).toEqual(1);
		// Assert alert sent to user
		expect(newState.alerts.alertType).toBe("fail");
	});
});
