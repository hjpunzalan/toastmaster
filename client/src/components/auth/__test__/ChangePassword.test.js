import React from "react";
import { shallow } from "enzyme";
import { createBrowserHistory } from "history";
import { findByTestAttr, storeFactory } from "../../../utils/testUtils";
import { setAlert, resetAlert } from "../../../actions/alerts";
import { changePassword } from "../../../actions/auth";

import ChangePassword, { inputs } from "../ChangePassword";
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
	const component = wrapper.find(".Form");
	expect(component).toHaveLength(1);
	// Should hide spinner
	expect(wrapper.contains(<Spinner />)).toBe(false);
	// Should render all component children
	expect(component.find(".Form__goBack")).toHaveLength(1);
	expect(component.find(".Form__text")).toHaveLength(1);
	const form = component.find(".Form__form");
	expect(form).toHaveLength(1);
});

test("cancel button works", () => {
	const wrapper = setup({
		auth: { loading: false },
	});
	const button = wrapper.find(".Form__goBack");
	expect(button.length).toBe(1);
	// Simulate click
	jest.spyOn(history, "push");
	button.simulate("click");
	expect(history.push).toHaveBeenCalledWith("/dashboard");

	// Obtain form values from inputs array
	const formValues = inputs.map((input) => input.value);
	// Assert empty inputs
	formValues.forEach((v) => expect(v).toBe(""));
});

test("renders form text", () => {
	const wrapper = setup({
		auth: { loading: false },
	});
	const formText = wrapper.find(".Form__text");
	expect(formText.text()).toBe(
		"Changing your password will log you out from other devices."
	);
});

test("form renders all the children", () => {
	const wrapper = setup({
		auth: { loading: false },
	});
	const form = wrapper.find(".Form__form");
	const labels = form.find("label");
	const labelsText = labels.find("b");

	// Make sure all labels are there and correctly labeled in order
	labelsText.forEach((t, i) => expect(t.text()).toEqual(inputs[i].label));

	// Correct number of input passwords
	expect(form.find("[type='password']").length).toEqual(3);

	// Renders input submit
	const submitButton = form.find("[type='submit']");
	expect(submitButton.props().value).toEqual("Change Password");
});
