import React from "react";
import { mount, shallow } from "enzyme";
import { Provider } from "react-redux";
import { createBrowserHistory } from "history";
import { findByTestAttr, storeFactory } from "../../../utils/testUtils";
import { setAlert, resetAlert } from "../../../actions/alerts";
import { changePassword } from "../../../actions/users";

import ChangePassword from "../ChangePassword";

const history = createBrowserHistory();
const defaultProps = {
	history,
	setAlert,
	resetAlert,
	changePassword,
};

// Setup function that returns wrapper
const setup = (props = {}) => {
	// default props and props together and may be overwritten
	// destructuring matters in order
	let initialState = { auth: { ...props.auth } };
	const store = storeFactory(initialState);
	const setupProps = { ...defaultProps, ...props };
	return shallow(<ChangePassword {...setupProps} store={store} />)
		.dive()
		.dive();
};

// FOR DEBUGGING
// console.log(wrapper.debug());
// console.log(wrapper.props());

test("renders without error", () => {
	const wrapper = setup({
		auth: { loading: false },
	});
	const component = findByTestAttr(wrapper, "component-changepassword");
	expect(component.length).toBe(1);
});
