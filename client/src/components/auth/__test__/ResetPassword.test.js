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
