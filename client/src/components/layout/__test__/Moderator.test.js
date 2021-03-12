import React from "react";
import { shallow } from "enzyme";
import { Moderator } from "../Moderator";
import { toggleView } from "../../../actions/users";

const initialProps = {
	auth: {
		currentUser: {
			role: "committee",
		},
	},
	toggleView,
	users: { Moderator: false },
};

// Setup function that returns wrapper
const setup = (props = {}) => {
	const setupProps = { ...initialProps, ...props };
	return shallow(<Moderator {...setupProps} />);
};

// FOR DEBUGGING
// console.log(wrapper.debug());
// console.log(wrapper.props());

describe("As moderator", () => {
	const toggleViewMock = jest.fn();
	const wrapper = setup({
		toggleView: toggleViewMock,
	});

	test("Renders moderator view unchecked as a committee", () => {
		expect(wrapper.find(".Moderator").length).toBe(1);
		expect(wrapper.find(".Moderator__checked").length).toBe(0);
	});

	test("Renders all children", () => {
		expect(wrapper.find(".Moderator__mode").props().children.length).not.toBe(
			0
		);
		expect(wrapper.find(".Moderator__checkbox").length).toBe(1);
		expect(wrapper.find(".Moderator__slider").length).toBe(1);
	});

	test("Checkbox should work ", () => {
		expect(wrapper.find(".Moderator__checked").length).toBe(0);
		wrapper.find(".Moderator__checkbox").simulate("change");
		expect(wrapper.find(".Moderator__checked").length).toBe(1);
	});
});
