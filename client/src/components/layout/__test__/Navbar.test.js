import React from "react";
import { shallow } from "enzyme";
import { Navbar } from "../Navbar";
import { logoutUser } from "../../../actions/auth";

const initialProps = { auth: { isAuthenticated: false }, logoutUser };

// Setup function that returns wrapper
const setup = (props = {}) => {
	const setupProps = { ...initialProps, ...props };
	return shallow(<Navbar {...setupProps} />);
};

// FOR DEBUGGING
// console.log(wrapper.debug());
// console.log(wrapper.props());

test("renders nav bar", () => {
	const wrapper = setup();
	expect(wrapper.find(".Navbar").length).toBe(1);
});
