import React from "react";
import { shallow } from "enzyme";
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
		alertType: null,
	});
	expect(wrapper.find(".Alert").length).toBe(0);
});

test("Shows alert if there is an alert type of success", () => {
	const wrapper = setup({
		alertType: "success",
	});
	expect(wrapper.find(".Alert.Alert__success").length).toBe(1);
});

test("Shows alert if there is an alert type of fail", () => {
	const wrapper = setup({
		alertType: "fail",
	});
	expect(wrapper.find(".Alert.Alert__fail").length).toBe(1);
});
