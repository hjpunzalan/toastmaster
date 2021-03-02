import React from "react";
import { shallow } from "enzyme";
import { createBrowserHistory } from "history";

import { ForgotPassword } from "../ForgotPassword";
import Spinner from "../../utils/Spinner";
import { forgotPassword } from "../../../actions/auth";

const history = createBrowserHistory();

const initialProps = {
	forgotPassword,
	auth: { loading: true },
};

// Setup function that returns wrapper
const setup = (props = {}) => {
	const setupProps = { ...initialProps, ...props };
	return shallow(<ForgotPassword {...setupProps} history={history} />);
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

	// Correct number of input text
	expect(form.find("[type='text']").length).toEqual(1);
	expect(form.find("[type='text']").props().placeholder).not.toBe(0);

	// Renders input submit
	const submitButton = form.find("[type='submit']");
	expect(submitButton.props().value.length).not.toBe(0);
});

test("input email should be initially blank and onChange works", () => {
	const wrapper = setup({
		auth: { loading: false },
	});

	const input = wrapper.find("[type='text']");
	// Should be empty initially
	expect(input.props().value).toEqual("");
	// Simulate typing
	input.simulate("change", {
		target: { value: "test@example.com" },
	});
	// Assert input values
	// Wrappers(except root one) are immutable so you need to .find() element again.
	expect(wrapper.find("[type='text']").props().value).toEqual(
		"test@example.com"
	);
});
