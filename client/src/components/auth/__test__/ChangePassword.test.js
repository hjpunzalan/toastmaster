import React from "react";
import { shallow } from "enzyme";
import { createBrowserHistory } from "history";
import { findByTestAttr, storeFactory } from "../../../utils/testUtils";
import { setAlert, resetAlert } from "../../../actions/alerts";
import { changePassword } from "../../../actions/users";

import ChangePassword from "../ChangePassword";
import Spinner from "../../utils/Spinner";

const history = createBrowserHistory();
const defaultProps = {
	history,
	setAlert,
	resetAlert,
	changePassword,
};

// Setup function that returns wrapper
const setup = (props = {}) => {
	// default props and props together and may be overwritten
	// destructuring matters in order
	let initialState = { auth: { ...props.auth } };
	const store = storeFactory(initialState);
	const setupProps = { ...defaultProps, ...props };
	return shallow(<ChangePassword {...setupProps} store={store} />)
		.dive()
		.dive();
};

// FOR DEBUGGING
// console.log(wrapper.debug());
// console.log(wrapper.props());

test("render with spinner when loading is true", () => {
	const wrapper = setup({
		auth: { loading: true },
	});
	expect(wrapper.contains(<Spinner />)).toBe(true);
});

test("renders without error when loading is false", () => {
	const wrapper = setup({
		auth: { loading: false },
	});
	const component = findByTestAttr(wrapper, "component-changepassword");
	expect(component.length).toBe(1);
	// Should hide spinner
	expect(wrapper.contains(<Spinner />)).toBe(false);
});

test("cancel button works", () => {
	const wrapper = setup({
		auth: { loading: false },
	});
	const button = findByTestAttr(wrapper, "cancel-button");
	expect(button.length).toBe(1);
	// Simulate click
	jest.spyOn(history, "push");
	button.simulate("click");
	expect(history.push).toHaveBeenCalledWith("/dashboard");
});
