import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { createBrowserHistory } from "history";
import { storeFactory } from "../../../utils/testUtils";
import { setAlert } from "../../alerts";
import {
	loginUser,
	checkUser,
	logoutUser,
	forgotPassword,
	resetPassword,
	changePassword,
} from "../../auth";
import { initialState } from "../../../reducers/auth";

describe("should send auth error when request fails", () => {
	const store = storeFactory();
	const error = {
		statusText: "fail",
		status: 401,
		message: "fail message",
	};

	const user = {
		_id: "test",
		email: "test@example.com",
		password: "testing",
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
		// Reset alert
		expect(alerts.msg.length).toEqual(1);

		// Assert redirection of user
		expect(history.push).not.toHaveBeenCalledWith("/dashboard");
	});
	test("should send auth error/stop loading when user is not logged in", async () => {
		const mock = new MockAdapter(axios);
		mock.onGet("/api/auth/checkUser").reply(404, error);

		await store.dispatch(checkUser());
		// GET CURRENT STATE
		const { auth } = store.getState();
		// Assert auth error
		expect(auth).toEqual({ ...initialState, loading: false });
	});

	test("should stop loading when theres error logging out ", async () => {
		const mock = new MockAdapter(axios);
		mock.onGet("/api/auth/logout").reply(500);

		await store.dispatch(logoutUser());
		// GET CURRENT STATE
		const { auth } = store.getState();
		// Assert auth error
		expect(auth).toEqual({ ...initialState, loading: false });
	});

	test("should send error if user doesnt exist/sending email when forgetting password", async () => {
		const mock = new MockAdapter(axios);
		mock
			.onPost("/api/auth/forgotPassword")
			.reply(404, error)
			.onGet("/api/auth/logout")
			.reply(200);

		// Test reset alert
		const msg = "test";
		const alertType = "success";
		store.dispatch(setAlert(msg, alertType));

		await store.dispatch(forgotPassword(user.email, "test"));
		// GET CURRENT STATE
		const { auth, alerts } = store.getState();
		// Assert auth error
		expect(auth).toEqual({ ...initialState, loading: false });
		// Alert sent to user
		expect(alerts.alertType).toEqual("fail");
		// Reset alert
		expect(alerts.msg.length).toEqual(1);
	});
	test("should send error if token invalid when resetting password", async () => {
		const token = "testtoken";
		const mock = new MockAdapter(axios);
		mock
			.onPatch(`/api/auth/resetPassword/${token}`)
			.reply(400, error)
			.onGet("/api/auth/logout")
			.reply(200);

		// Test reset alert
		const msg = "test";
		const alertType = "success";
		store.dispatch(setAlert(msg, alertType));

		const history = createBrowserHistory();
		jest.spyOn(history, "push");

		await store.dispatch(resetPassword({password: "test", resetToken: token, history}));
		// GET CURRENT STATE
		const { auth, alerts } = store.getState();

		// Assert auth error
		expect(auth).toEqual({ ...initialState, loading: false });
		// Alert sent to user
		expect(alerts.alertType).toEqual("fail");
		// Reset alert
		expect(alerts.msg.length).toEqual(1);

		// Assert redirection of user
		expect(history.push).not.toHaveBeenCalledWith("/dashboard");
	});
	test("send error when changing password", async () => {
		const mock = new MockAdapter(axios);
		mock
			.onPost("/api/users/updatePassword",{
					currentPassword: user.password,
					newPassword: "test12345",
				})
			.reply(401, error)
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
			changePassword({
				formData: {
					currentPassword: user.password,
					newPassword: "test12345",
				},
				history,
			})
		);
		// GET CURRENT STATE
		const { auth, alerts } = store.getState();

		// Assert auth error
		expect(auth).toEqual({ ...initialState, loading: false });
		// Alert sent to user
		expect(alerts.alertType).toEqual("fail");
		// Reset alert
		expect(alerts.msg.length).toEqual(1);

		// Assert redirection of user
		expect(history.push).not.toHaveBeenCalledWith("/dashboard");
	});
});
