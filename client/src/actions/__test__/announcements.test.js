// integration test that test both action and reducer
import { storeFactory } from "../../utils/testUtils";
import { toggleEdit } from "../announcements";

test("should toggle edit and reset alert", () => {
	const store = storeFactory();

	store.dispatch(toggleEdit());

	const { announcements, alerts } = store.getState();
	// alert state should reset
	expect(alerts.msg.length).toBe(0);
	// Initial edit property should be false
	expect(announcements.edit).toBe(true);
});
