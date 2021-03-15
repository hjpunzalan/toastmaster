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

test('render Logo', () => {
	const wrapper = setup();
	expect(wrapper.find(".Navbar__left .Navbar__item .Navbar__logo").length).toBe(1);
})

test('Render text and caption', () => {
	const wrapper = setup();
	const header = wrapper.find(".Navbar__left .Navbar__header")
	expect(header.props().children.length).toBe(2)
	expect(header.find(".Navbar__item.Navbar__header-text").props().children.length).not.toBe(0);
	expect(header.find(".Navbar__item.Navbar__header-caption").props().children.length).not.toBe(0);
})



describe('Not Authenticated', () => {
	const wrapper = setup({ auth: { isAuthenticated: false } });
	// Check if theres only login on nav bar link
	expect(wrapper.find(".Navbar__right .Navbar__item").length).toBe(1)
})
