import React from "react";
import { shallow } from "enzyme";
import { Redirect } from "react-router-dom";
import { Alert } from "../Alert";

const initialProps = {
	msg: ["test"],
	alertType: "success",
};

// Setup function that returns wrapper
const setup = (props = {}) => {
	const setupProps = { ...initialProps, ...props };
	return shallow(<Alert {...setupProps} />);
};

// FOR DEBUGGING
// console.log(wrapper.debug());
// console.log(wrapper.props());

test("No alerts if there's no alert type", () => {
	const wrapper = setup({
		alertType: "success",
	});
	expect(wrapper.find(".Alert.Alert__success").length).toBe(1);
});
