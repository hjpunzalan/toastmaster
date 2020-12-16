import moxios from "moxios";
import { createBrowserHistory } from "history";
import { storeFactory } from "../../utils/testUtils";
import { setAlert } from "../alerts";
import { loginUser } from "../auth";

describe("AUTH request patterns", () => {
	// Insert a specific axios instance
	beforeEach(() => {
		moxios.install();
	});
	afterEach(() => {
		moxios.uninstall();
	});

	const user = {
		_id: "test",
		email: "test@example.com",
		password: "testing",
	};

	test("should login user", async () => {
		const store = storeFactory();

		moxios.wait(() => {
			// Define how moxios respond from axios
			const request = moxios.requests.mostRecent();
			request.respondWith({
				status: 200,
				response: {
					_id: user._id,
					email: user.email,
				},
			});
		});

		// Test reset alert
		const msg = "test";
		const alertType = "success";
		store.dispatch(setAlert(msg, alertType));

		// Spy mock on history
		const history = createBrowserHistory();
		jest.spyOn(history, "push");

		// Dispatch create announcement action
		await store.dispatch(
			loginUser({
				formData: { email: user.email, password: user.password },
				history,
			})
		);
		const { auth, alerts } = store.getState();

		// Assert reset alert works
		expect(alerts.msg.length).toEqual(0);

		// Assert login user
		expect(auth.currentUser.email).toBe(user.email);

		// Assert redirection of user
		expect(history.push).toHaveBeenCalledWith("/dashboard");
	});
});
