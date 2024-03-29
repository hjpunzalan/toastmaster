import React from "react";
import { shallow } from "enzyme";
import { createBrowserHistory } from "history";

import { ChangePassword, inputs } from "../ChangePassword";
import Spinner from "../../utils/Spinner";
import { setAlert, resetAlert } from "../../../actions/alerts";
import { changePassword } from "../../../actions/auth";

const history = createBrowserHistory();

const initialProps = {
	setAlert,
	resetAlert,
	changePassword,
	history,
	auth: { loading: true },
};

// Setup function that returns wrapper
const setup = (props = {}) => {
	const setupProps = { ...initialProps, ...props };
	return shallow(<ChangePassword {...setupProps} history={history} />);
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

describe("renders without error when loading is false", () => {
	const wrapper = setup({
		auth: { loading: false },
	});
	const component = wrapper.find(".Form");
	test("should render component", () => {
		expect(component).toHaveLength(1);
	});
	test("should hide spinner", () => {
		expect(wrapper.contains(<Spinner />)).toBe(false);
	});
	test("should render all component children", () => {
		expect(component.find(".Form__goBack")).toHaveLength(1);
		expect(component.find("h1")).toHaveLength(1);
		expect(component.find(".Form__text")).toHaveLength(1);
		expect(component.find(".Form__form")).toHaveLength(1);
	});
});

test("cancel button works", () => {
	const wrapper = setup({
		auth: { loading: false },
	});
	const button = wrapper.find(".Form__goBack");
	expect(button.length).toBe(1);
	expect(button.text().length).not.toBe(0);
	// Simulate click
	jest.spyOn(history, "push");
	button.simulate("click");
	expect(history.push).toHaveBeenCalledWith("/dashboard");
});

test("renders h1 is not empty", () => {
	const wrapper = setup({
		auth: { loading: false },
	});
	expect(wrapper.find("h1").text().length).not.toBe(0);
});

test("renders form text is not empty", () => {
	const wrapper = setup({
		auth: { loading: false },
	});
	const formText = wrapper.find(".Form__text");
	expect(formText.text().length).not.toBe(0);
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

	// Correct placeholders in inputs
	form
		.find("[type='password']")
		.forEach((input, i) =>
			expect(input.props().placeholder).toEqual(inputs[i].placeholder)
		);

	// Renders input submit
	const submitButton = form.find("[type='submit']");
	expect(submitButton.props().value).toEqual("Submit");
});

test("input passwords should be initially blank and handleChange works", () => {
	const wrapper = setup({
		auth: { loading: false },
	});

	const inputComponents = wrapper.find("[type='password']");
	// Make sure all inputs have correct value when text is typed
	const testPasswords = ["test111", "test222", "test333"];
	// Simulate typing
	inputComponents.forEach((input, i) => {
		// Assert an empty form
		expect(input.props().value).toEqual("");

		input.simulate("change", {
			target: { name: inputs[i].name, value: testPasswords[i] },
		});
		// Assert input values
		// Wrappers(except root one) are immutable so you need to .find() element again.
		expect(wrapper.find("[type='password']").get(i).props.value).toEqual(
			testPasswords[i]
		);
	});
});

test("Submit button should call change password when confirm password matches", () => {
	const changePasswordMock = jest.fn();
	const wrapper = setup({
		auth: { loading: false },
		changePassword: changePasswordMock,
		initialFormState: {
			currentPassword: "test123",
			newPassword: "test123",
			confirmPassword: "test123",
		},
	});

	// Simulate submit
	const form = wrapper.find("form");
	form.simulate("submit", { preventDefault() {} });
	expect(changePasswordMock.mock.calls.length).toBe(1);
});

test("Submit button should set alert fail when password does not match", () => {
	const setAlertMock = jest.fn();
	const resetAlertMock = jest.fn();
	const wrapper = setup({
		auth: { loading: false },
		setAlert: setAlertMock,
		resetAlert: resetAlertMock,
		initialFormState: {
			currentPassword: "test123",
			newPassword: "test123",
			confirmPassword: "test111",
		},
	});

	// Simulate submit when password does not match
	const form = wrapper.find("form");
	form.simulate("submit", { preventDefault() {} });
	expect(resetAlertMock.mock.calls.length).toEqual(1);
	expect(setAlertMock).toHaveBeenCalledWith("Passwords does not match", "fail");
});
