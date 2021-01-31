import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { createBrowserHistory } from "history";
import { storeFactory } from "../../utils/testUtils";
import { setAlert } from "../alerts";
import { initialState } from "../../reducers/users";
import { registerUser } from "../users";

describe("USER request patterns", () => {
	const testUser = {
		_id: "test",
		firstName: "test",
		lastName: "testLastName",
		email: "test@example.com",
		password: "testing",
	};

	test("should register user", async () => {
		const store = storeFactory();
		const mock = new MockAdapter(axios);

		// Mock axios request
		mock.onPost("/api/users/register").reply(200, {
			_id: testUser._id,
			email: testUser.email,
		});

		// Test reset alert
		const msg = "test";
		const alertType = "fail";
		store.dispatch(setAlert(msg, alertType));

		// Dispatch login action
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
		expect(users.loading).toBe(false);

		// Assert userss list
		expect(users.users.length).toBe(1);

		// Assert reset alert works
		expect(alerts.msg.length).toEqual(1);
		// Assert alert sent to user
		expect(alerts.alertType).toBe("success");
		expect(alerts.msg[0]).toBe(
			`${testUser.firstName} ${testUser.lastName} was successfully registered and temporary password sent to user's email`
		);
	});
});
