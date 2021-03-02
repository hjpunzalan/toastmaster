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
