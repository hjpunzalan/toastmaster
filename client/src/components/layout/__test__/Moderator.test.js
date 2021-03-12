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

test("Renders moderator view unchecked as a committee", () => {
	const wrapper = setup();
	expect(wrapper.find(".Moderator").length).toBe(1);
	expect(wrapper.find(".Moderator__checked").length).toBe(0);
});

test("Renders moderator view unchecked as an admin", () => {
	const wrapper = setup();
	expect(wrapper.find(".Moderator").length).toBe(1);
	expect(wrapper.find(".Moderator__checked").length).toBe(0);
});
