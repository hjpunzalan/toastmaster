import React from "react";
import { shallow } from "enzyme";
import { createBrowserHistory } from "history";
import { Redirect } from "react-router-dom";
import { Login } from "../Login";
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
