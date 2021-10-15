import React from "react";
import { shallow } from "enzyme";
import { Alert } from "../Alert";

const initialProps = {
	msg: [],
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
		msg: ["test"],
		alertType: "success",
		error: {}
	});
	expect(wrapper.find(".Alert.Alert__success").length).toBe(1);
});

test("Shows alert if there is an alert type of fail", () => {
		const error = {
		status: 401,
		msg: "fail message",
	};
	const wrapper = setup({
		msg: ["test"], 
		alertType: "fail",
		error
	});
	expect(wrapper.find(".Alert.Alert__fail").length).toBe(1);
});

test("should show alert message when alert type is success", () => {
	const wrapper = setup({
		msg: ["test"],
		alertType: "success",
		error: {}
	});
	expect(wrapper.find("strong").props().children).toBe("Success: ");
	expect(wrapper.find("p").props().children.length).not.toBe(0);
});

test("should show alert message when alert type is fail", () => {
	const error = {
		status: 401,
		msg: "fail message",
	};

	const wrapper = setup({
		msg: ["test"], 
		alertType: "fail",
		error
	});
	expect(wrapper.find("strong").props().children).toBe("Warning: ");
	expect(wrapper.find("p").props().children.length).not.toBe(0);
});
