// integration test that test both action and reducer
import { storeFactory } from "../../utils/testUtils";
import { setAlert, resetAlert } from "../alerts";
import { initialState } from "../../reducers/alerts";

test("adds new message and alert type of success to state and reset alert", () => {
	const store = storeFactory();

	const msg = "test";
	const alertType = "success";

	store.dispatch(setAlert(msg, alertType));

	const { alerts } = store.getState();
	expect(alerts.alertType).toBe(alertType);
	expect(alerts.msg[0]).toBe(msg);

	store.dispatch(resetAlert());
	const clearState = store.getState();
	expect(clearState.alerts).toEqual(initialState);
});

test("adds new message and alert type of fail to state", () => {
	const store = storeFactory();

	const msg = "test";
	const alertType = "fail";

	store.dispatch(setAlert(msg, alertType));

	const { alerts } = store.getState();
	expect(alerts.alertType).toBe(alertType);
	expect(alerts.msg[0]).toBe(msg);
});
