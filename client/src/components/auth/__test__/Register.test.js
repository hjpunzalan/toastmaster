import React from "react";
import { shallow } from "enzyme";
import { createBrowserHistory } from "history";
import { Redirect } from "react-router-dom";
import { Register, inputs } from "../Register";
import Spinner from "../../utils/Spinner";
import { setAlert, resetAlert } from "../../../actions/alerts";
import { registerUser } from "../../../actions/users";

const history = createBrowserHistory();

const initialProps = {
	registerUser,
	users: { loading: false, Moderator: true },
	auth: { currentUser: { role: "admin" } },
	history,
};

// Setup function that returns wrapper
const setup = (props = {}) => {
	const setupProps = { ...initialProps, ...props };
	return shallow(<Register {...setupProps} history={history} />);
};

// FOR DEBUGGING
// console.log(wrapper.debug());
// console.log(wrapper.props());

test("Redirect component when role is user", () => {
	const wrapper = setup({
		users: { loading: true, Moderator: false },
		auth: {
			currentUser: { role: "user" },
		},
	});
	expect(wrapper.contains(<Redirect to="/dashboard" />)).toBe(true);
});

describe("Role is committee and is a Moderator", () => {
	test("Render with spinner when loading is true", () => {
		const wrapper = setup({
			users: { loading: true, Moderator: true },
			auth: {
				currentUser: { role: "committee" },
			},
		});
		expect(wrapper.contains(<Spinner />)).toBe(true);
	});
	describe("When loading is false", () => {
		const wrapper = setup({
			users: { loading: false, Moderator: true },
			auth: {
				currentUser: { role: "committee" },
			},
		});
		const component = wrapper.find(".Form");
		//////////////////////////////////////////////////////
		test("should render component", () => {
			expect(component).toHaveLength(1);
		});
		test("should hide spinner", () => {
			expect(wrapper.contains(<Spinner />)).toBe(false);
		});
		test("should render all component children", () => {
			expect(component.find(".Form__goBack")).toHaveLength(1);
			expect(component.find("h1")).toHaveLength(1);
			expect(component.find(".Form__text")).toHaveLength(1);
			expect(component.find(".Form__form")).toHaveLength(1);
		});

		test("cancel button works", () => {
			const button = wrapper.find(".Form__goBack");
			expect(button.length).toBe(1);
			expect(button.text().length).not.toBe(0);
			// Simulate click
			jest.spyOn(history, "push");
			button.simulate("click");
			expect(history.push).toHaveBeenCalledWith("/members");
		});
	});
});
