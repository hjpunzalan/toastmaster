import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { createBrowserHistory } from "history";
import { storeFactory } from "../../utils/testUtils";
import { setAlert } from "../alerts";
import {
	loginUser,
	checkUser,
	logoutUser,
	forgotPassword,
	resetPassword,
	changePassword,
} from "../auth";
import { initialState } from "../../reducers/auth";

describe("AUTH request patterns", () => {
	const user = {
		_id: "test",
		email: "test@example.com",
		password: "testing",
	};

	test("should login and logout", async () => {
		const store = storeFactory();

		const mock = new MockAdapter(axios);

		// Mock axios request for login and logout
		mock
			.onPost("/api/auth/login")
			.reply(200, {
				_id: user._id,
				email: user.email,
			})
			.onGet("/api/auth/logout")
			.reply(200);

		// Test reset alert
		const msg = "test";
		const alertType = "fail";
		store.dispatch(setAlert(msg, alertType));

		// Spy mock on history
		const history = createBrowserHistory();
		jest.spyOn(history, "push");

		// Dispatch login action
		await store.dispatch(
			loginUser({
				formData: { email: user.email, password: user.password },
				history,
			})
		);
		const { auth, alerts } = store.getState();

		expect(auth.loading).toBe(false);

		// Assert reset alert works
		expect(alerts.msg.length).toEqual(0);

		// Assert login user
		expect(auth.currentUser.email).toBe(user.email);

		// Assert redirection of user
		expect(history.push).toHaveBeenCalledWith("/dashboard");

		// Dispatch logout action
		await store.dispatch(logoutUser());

		const logoutState = store.getState();

		// Assert login user
		expect(logoutState.auth).toEqual({ ...initialState, loading: false });
	});

	test("should authenticate user if logged in already", async () => {
		const store = storeFactory();

		const mock = new MockAdapter(axios);

		// Mock axios request for check user
		mock.onGet("/api/auth/checkUser").reply(200, {
			_id: user._id,
			email: user.email,
		});
		// Dispatch create checkuser action
		await store.dispatch(checkUser());
		const { auth } = store.getState();

		// Assert login user
		expect(auth.loading).toBe(false);
		expect(auth.currentUser.email).toBe(user.email);
	});

	test("forgot password", async () => {
		const store = storeFactory();

		const mock = new MockAdapter(axios);

		// Mock axios request for forgot password
		mock.onPost("/api/auth/forgotPassword").reply(200);

		// Dispatch create forgot password action
		await store.dispatch(forgotPassword("test@example.com", "localhost:3000"));
		const { auth, alerts } = store.getState();

		// Assert auth loading and alert sent
		expect(auth).toEqual({ ...initialState, loading: false });
		expect(alerts.msg.length).toEqual(1);
		expect(alerts.alertType).toBe("success");
	});

	test("should reset passsword", async () => {
		const store = storeFactory();

		const mock = new MockAdapter(axios);

		// Mock axios request for reset password
		mock.onPatch("/api/auth/resetPassword/test").reply(200, {
			_id: user._id,
			email: user.email,
		});

		// Test reset alert
		const msg = "test";
		const alertType = "fail";
		store.dispatch(setAlert(msg, alertType));

		// Spy mock on history
		const history = createBrowserHistory();
		jest.spyOn(history, "push");

		// Dispatch login action
		await store.dispatch(
			resetPassword({
				password: user.password,
				resetToken: "test",
				history,
			})
		);
		const { auth, alerts } = store.getState();

		// Assert auth loading, alert sent, history push
		expect(auth.loading).toBe(false);
		expect(alerts.msg.length).toEqual(1);
		expect(alerts.alertType).toBe("success");
		expect(history.push).toHaveBeenCalledWith("/dashboard");
	});

	test("should change password", async () => {
		const store = storeFactory();
		const mock = new MockAdapter(axios);

		// Mock axios request for change password
		mock.onPost("/api/users/updatePassword").reply(200, {
			_id: user._id,
			email: user.email,
		});

		// Test reset alert
		const msg = "test";
		const alertType = "fail";
		store.dispatch(setAlert(msg, alertType));

		// Spy mock on history
		const history = createBrowserHistory();
		jest.spyOn(history, "push");

		// Dispatch login action
		await store.dispatch(
			changePassword({
				formData: { currentPassword: user.password, newPassword: "test1212" },
				history,
			})
		);
		const { auth, alerts } = store.getState();

		// Assert auth loading, alert sent, history push
		expect(auth.loading).toBe(false);
		expect(alerts.msg.length).toEqual(1);
		expect(alerts.alertType).toBe("success");
		expect(history.push).toHaveBeenCalledWith("/dashboard");
	});

	describe("should send auth error when request fails", () => {
		const store = storeFactory();
		const error = {
			statusText: "fail",
			status: 401,
			message: "fail message",
		};

		test("should send error when logging user in", async () => {
			const mock = new MockAdapter(axios);
			mock
				.onPost("/api/auth/login")
				.reply(401, error)
				.onGet("/api/auth/logout")
				.reply(200);

			// Test reset alert
			const msg = "test";
			const alertType = "success";
			store.dispatch(setAlert(msg, alertType));

			// Spy mock on history
			const history = createBrowserHistory();
			jest.spyOn(history, "push");

			await store.dispatch(
				loginUser({
					formData: { email: user.email, password: user.password },
					history,
				})
			);
			// GET CURRENT STATE
			const { auth, alerts } = store.getState();
			// Assert announcement error
			expect(auth).toEqual({ ...initialState, loading: false });
			// Alert sent to user
			expect(alerts.alertType).toEqual("fail");
		});
		test("should send auth error when user is not logged in", async () => {
			const mock = new MockAdapter(axios);
			mock.onGet("/api/auth/checkUser").reply(404, error);

			await store.dispatch(checkUser());
			// GET CURRENT STATE
			const { auth } = store.getState();
			// Assert announcement error
			expect(auth).toEqual({ ...initialState, loading: false });
		});
	});
});
