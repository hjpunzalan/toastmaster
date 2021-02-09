import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { createBrowserHistory } from "history";
import { storeFactory } from "../../utils/testUtils";
import { setAlert } from "../alerts";
import { initialState } from "../../reducers/users";
import { registerUser, updateMe, getAllUsers } from "../users";

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

	test("should update user", async () => {
		const store = storeFactory();
		const mock = new MockAdapter(axios);

		// props
		const url = "testUrl";
		const key = "testPhoto";
		const file = { file: "data" };
		const updatedUser = {
			...testUser,
			photo: `https://toastmaster-user-photo.s3-ap-southeast-2.amazonaws.com/${key}`,
		};

		// Mock axios request
		mock
			.onPost("/api/upload")
			.reply(200, {
				url,
				key,
			})
			.onPut(url)
			.reply(200)
			.onPatch("/api/users/updateMe")
			.reply(200, testUser);

		// Test reset alert
		const msg = "test";
		const alertType = "fail";
		store.dispatch(setAlert(msg, alertType));

		// Spy mock on history
		const history = createBrowserHistory();
		jest.spyOn(history, "push");

		// Dispatch login action with file
		await store.dispatch(updateMe(testUser, file, history));
		const { auth, alerts } = store.getState();
		// Assert loading
		expect(auth.loading).toBe(false);

		// Assert current user
		expect(auth.currentUser).toEqual(updatedUser);

		// Assert modification
		expect(auth.isModified).toBe(true);

		// Assert history redirection
		expect(history.push).toHaveBeenCalledWith("/dashboard");

		// Assert reset alert works
		expect(alerts.msg.length).toEqual(1);
		// Assert alert sent to user
		expect(alerts.alertType).toBe("success");
		expect(alerts.msg[0]).toBe("User updated");
	});

	test("should get all users", async () => {
		const store = storeFactory();
		const mock = new MockAdapter(axios);

		// Mock axios request
		mock.onGet("/api/users?sort=firstName").reply(200, [testUser]);

		// Dispatch login action
		await store.dispatch(getAllUsers());
		const { users } = store.getState();
		// Assert loading
		expect(users.loading).toBe(false);

		// Assert userss list
		expect(users.users.length).toBe(1);
	});
});
