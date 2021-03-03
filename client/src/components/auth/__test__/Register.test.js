import React from "react";
import { shallow } from "enzyme";
import { createBrowserHistory } from "history";
import { Redirect } from "react-router-dom";
import { Register, inputs } from "../Register";
import Spinner from "../../utils/Spinner";
import { setAlert, resetAlert } from "../../../actions/alerts";
import { registerUser } from "../../../actions/users";

const history = createBrowserHistory();

const initialProps = {
	registerUser,
	users: { loading: false, Moderator: true },
	auth: { currentUser: { role: "admin" } },
	history,
};

// Setup function that returns wrapper
const setup = (props = {}) => {
	const setupProps = { ...initialProps, ...props };
	return shallow(<Register {...setupProps} history={history} />);
};

// FOR DEBUGGING
// console.log(wrapper.debug());
// console.log(wrapper.props());

test("Redirect component when role is user", () => {
	const wrapper = setup({
		users: { loading: true, Moderator: false },
		auth: {
			currentUser: { role: "user" },
		},
	});
	expect(wrapper.contains(<Redirect to="/dashboard" />)).toBe(true);
});

test("render with spinner when loading is true", () => {
	const wrapper = setup({
		users: { loading: true, Moderator: true },
		auth: {
			currentUser: { role: "committee" },
		},
	});
	expect(wrapper.contains(<Spinner />)).toBe(true);
});
