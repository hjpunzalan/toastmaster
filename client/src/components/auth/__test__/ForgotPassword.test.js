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
