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
			registerUser(
				{
					email: testUser.email,
					firstName: testUser.firstName,
					lastName: testUser.lastName,
				},
				"testUrl"
			)
		);
	};

	test("should send error when registering user", async () => {
		const store = storeFactory();
		const mock = new MockAdapter(axios);

		// Test reset alert
		const msg = "test";
		const alertType = "fail";
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
});
