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

test('should  render Logo', () => {
	const wrapper = setup();
	expect(wrapper.find(".Navbar__left .Navbar__item .Navbar__logo").length).toBe(1);
})


describe('Not Authenticated', () => {
	const wrapper = setup({ auth: { isAuthenticated: false } });
	// Check if theres only login on nav bar link
	expect(wrapper.find(".Navbar__right .Navbar__item").length).toBe(1)
})
