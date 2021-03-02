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
