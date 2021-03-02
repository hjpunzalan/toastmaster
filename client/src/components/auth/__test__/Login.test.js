import React from "react";
import { shallow } from "enzyme";
import { createBrowserHistory } from "history";
import { Redirect } from "react-router-dom";
import { Login, inputs } from "../Login";
import Spinner from "../../utils/Spinner";
import { loginUser } from "../../../actions/auth";

const history = createBrowserHistory();

const initialProps = {
	loginUser,
	history,
	auth: { isAuthenticated: false, loading: true },
};

// Setup function that returns wrapper
const setup = (props = {}) => {
	const setupProps = { ...initialProps, ...props };
	return shallow(<Login {...setupProps} history={history} />);
};

// FOR DEBUGGING
// console.log(wrapper.debug());
// console.log(wrapper.props());

test("redirect if user is already authenticated", () => {
	const wrapper = setup({
		auth: { isAuthenticated: true, loading: false },
	});
	expect(wrapper.contains(<Redirect to="/dashboard" />)).toBe(true);
});

test("render with spinner when loading is true", () => {
	const wrapper = setup({
		auth: { loading: true },
	});
	expect(wrapper.contains(<Spinner />)).toBe(true);
});

describe("renders without error when loading and isAuthenticated is false", () => {
	const wrapper = setup({
		auth: { isAuthenticated: false, loading: false },
	});
	const component = wrapper.find(".Form");
	test("should render component", () => {
		expect(component).toHaveLength(1);
	});
	test("should hide spinner", () => {
		expect(wrapper.contains(<Spinner />)).toBe(false);
	});

	test("should hide Redirect", () => {
		expect(wrapper.contains(<Redirect to="/dashboard" />)).toBe(false);
	});

	test("should render all component children", () => {
		expect(component.find("h1")).toHaveLength(1);
		expect(component.find(".Form__text")).toHaveLength(1);
		expect(component.find(".Form__form")).toHaveLength(1);
	});
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

	// Correct number of inputs
	const emailInput = form.find("[type='text']");
	const passwordInput = form.find("[type='password']");
	expect(emailInput.length).toEqual(1);
	expect(passwordInput.length).toEqual(1);

	// Correct placeholders in inputs
	expect(emailInput.props().placeholder).toEqual(inputs[0].placeholder);
	expect(passwordInput.props().placeholder).toEqual(inputs[1].placeholder);

	// Renders input submit
	const submitButton = form.find("[type='submit']");
	expect(submitButton.props().value).toEqual("Login");
});

test("inputs should be initially blank and handleChange works", () => {
	const wrapper = setup({
		auth: { loading: false },
	});

	expect(wrapper.find("[type='text']").props().value).toEqual("");
	expect(wrapper.find("[type='password']").props().value).toEqual("");

	wrapper.find("[type='text']").simulate("change", {
		target: { name: inputs[0].name, value: "test@example.com" },
	});
	wrapper.find("[type='password']").simulate("change", {
		target: { name: inputs[1].name, value: "test123" },
	});
	// Assert input values
	// Wrappers(except root one) are immutable so you need to .find() element again.
	expect(wrapper.find("[type='text']").props().value).toEqual(
		"test@example.com"
	);
	expect(wrapper.find("[type='password']").props().value).toEqual("test123");
});
