import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { createBrowserHistory } from "history";
import { storeFactory } from "../../utils/testUtils";
import { setAlert } from "../alerts";
import { initialState } from "../../reducers/users";
import {
	registerUser,
	updateMe,
	getAllUsers,
	toggleView,
	deActivateUser,
	activateUser,
	changeRole,
} from "../users";

describe("USER request patterns", () => {
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

	test("should register user", async () => {
		const store = storeFactory();
		const mock = new MockAdapter(axios);

		// Test reset alert
		const msg = "test";
		const alertType = "fail";
		store.dispatch(setAlert(msg, alertType));

		// Mock register request and dispatch action
		await registerTestUser(mock, store);

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
		const file = { file: "data", type:"jpg" };
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

		// Dispatch action
		await store.dispatch(updateMe({formData: testUser, file, history}));
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

		// Dispatch get all users action
		await store.dispatch(getAllUsers());
		const { users } = store.getState();
		// Assert loading
		expect(users.loading).toBe(false);

		// Assert userss list
		expect(users.users.length).toBe(1);
	});

	test("should toggle user view state if user is committee or admin", () => {
		const store = storeFactory();
		store.dispatch(toggleView());
		const { users } = store.getState();
		// Assert user moderator view state has been changed
		expect(users.Moderator).not.toEqual(initialState.Moderator);
	});

	test("should deactivate user by user id", async () => {
		const store = storeFactory();
		const mock = new MockAdapter(axios);

		// Mock axios request
		mock
			.onPatch(`/api/users/deActivateUser/${testUser._id}`)
			.reply(200, { ...testUser, active: false });

		// Test reset alert
		const msg = "test";
		const alertType = "fail";
		store.dispatch(setAlert(msg, alertType));

		// Register user first
		// Mock register request and dispatch action
		await registerTestUser(mock, store);

		// Dispatch  action
		await store.dispatch(deActivateUser(testUser._id));
		const { users, alerts } = store.getState();
		// Assert loading
		expect(users.loading).toBe(false);

		// Assert user deactivated
		expect(users.users[0].active).toBe(false);

		// Assert reset alert works
		expect(alerts.msg.length).toEqual(1);
		// Assert alert sent to user
		expect(alerts.alertType).toBe("success");
		expect(alerts.msg[0]).toBe(
			`${testUser.firstName} ${testUser.lastName} has been deactivated!`
		);
	});

	test("should reActivate user", async () => {
		const store = storeFactory();
		const mock = new MockAdapter(axios);

		// Mock axios request
		mock
			.onPatch(`/api/users/activateUser/${testUser._id}`)
			.reply(200, { ...testUser, active: true });

		// Test reset alert
		const msg = "test";
		const alertType = "fail";
		store.dispatch(setAlert(msg, alertType));

		// Register user first
		// Mock register request and dispatch action
		await registerTestUser(mock, store);

		// Dispatch  action
		await store.dispatch(activateUser(testUser._id));
		const { users, alerts } = store.getState();
		// Assert loading
		expect(users.loading).toBe(false);

		// Assert user deactivated
		expect(users.users[0].active).toBe(true);

		// Assert reset alert works
		expect(alerts.msg.length).toEqual(1);
		// Assert alert sent to user
		expect(alerts.alertType).toBe("success");
		expect(alerts.msg[0]).toBe(
			`${testUser.firstName} ${testUser.lastName} has been activated!`
		);
	});

	test("should change role", async () => {
		const store = storeFactory();
		const mock = new MockAdapter(axios);

		// Mock axios request
		mock
			.onPatch(`/api/users/makeCommittee/${testUser._id}`)
			.reply(200, { ...testUser, role: "committee" })
			.onPatch(`/api/users/removeCommittee/${testUser._id}`)
			.reply(200, { ...testUser, role: "user" });

		// Test reset alert
		const msg = "test";
		const alertType = "fail";
		store.dispatch(setAlert(msg, alertType));

		// Register user first
		// Mock register request and dispatch action
		await registerTestUser(mock, store);

		// Dispatch  action change role to committee
		await store.dispatch(changeRole(testUser._id, "true"));

		const { users, alerts } = store.getState();
		// Assert loading
		expect(users.loading).toBe(false);

		// Assert user role
		expect(users.users[0].role).toBe("committee");

		// Assert reset alert works
		expect(alerts.msg.length).toEqual(1);
		// Assert alert sent to user
		expect(alerts.alertType).toBe("success");
		expect(alerts.msg[0]).toBe(
			`${testUser.firstName} ${testUser.lastName} is now a committee member`
		);
		//////////////////

		// Dispatch  action change role demote to user
		await store.dispatch(changeRole(testUser._id, "false"));

		const newState = store.getState();

		// Assert user role
		expect(newState.users.users[0].role).toBe("user");

		// Assert reset alert works
		expect(newState.alerts.msg.length).toEqual(1);
		// Assert alert sent to user
		expect(newState.alerts.alertType).toBe("success");
		expect(newState.alerts.msg[0]).toBe(
			`${testUser.firstName} ${testUser.lastName} is back to a normal member`
		);
	});
});
