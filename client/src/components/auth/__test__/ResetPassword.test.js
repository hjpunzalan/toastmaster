import React from "react";
import { shallow } from "enzyme";
import { createBrowserHistory } from "history";

import { ResetPassword, inputs } from "../ResetPassword";
import Spinner from "../../utils/Spinner";
import { setAlert, resetAlert } from "../../../actions/alerts";
import { resetPassword } from "../../../actions/auth";

const history = createBrowserHistory();
const resetToken = "testToken";

const initialProps = {
	setAlert,
	resetAlert,
	resetPassword,
	match: {
		params: { resetToken },
	},
	history,
	auth: { loading: true },
};

// Setup function that returns wrapper
const setup = (props = {}) => {
	const setupProps = { ...initialProps, ...props };
	return shallow(<ResetPassword {...setupProps} history={history} />);
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
		expect(component.find(".Form__btns")).toHaveLength(1);
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
});
