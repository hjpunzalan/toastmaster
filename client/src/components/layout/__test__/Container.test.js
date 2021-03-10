import React from "react";
import { shallow } from "enzyme";
import { Container } from "../Container";

const initialProps = {
	children: "test",
};

// Setup function that returns wrapper
const setup = (props = {}) => {
	const setupProps = { ...initialProps, ...props };
	return shallow(<Container {...setupProps} />);
};

// FOR DEBUGGING
// console.log(wrapper.debug());
// console.log(wrapper.props());

test("Container has children", () => {
	const wrapper = setup();
	expect(wrapper.find(".Container").props().children.length).not.toBe(0);
});
