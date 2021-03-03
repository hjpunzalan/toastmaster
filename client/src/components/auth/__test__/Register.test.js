import React from "react";
import { shallow } from "enzyme";
import { createBrowserHistory } from "history";
import { Redirect } from "react-router-dom";
import { Register, inputs } from "../Register";
import Spinner from "../../utils/Spinner";
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

		test("renders h1 is not empty", () => {
			expect(wrapper.find("h1").text().length).not.toBe(0);
		});

		test("renders form text is not empty", () => {
			const formText = wrapper.find(".Form__text");
			expect(formText.text().length).not.toBe(0);
		});

		test("form renders all the children", () => {
			const form = wrapper.find(".Form__form");
			const labels = form.find("label");
			const labelsText = labels.find("b");

			// Make sure all labels are there and correctly labeled in order
			labelsText.forEach((t, i) => expect(t.text()).toEqual(inputs[i].label));

			// Correct number of inputs
			expect(form.find("[type='text']").length).toEqual(2);
			expect(form.find("[type='email']").length).toEqual(1);

			// Correct placeholders in inputs
			form
				.find("[type='text']")
				.forEach((input, i) =>
					expect(input.props().placeholder).toEqual(inputs[i].placeholder)
				);
			expect(form.find("[type='email']").props().placeholder).toEqual(
				inputs[2].placeholder
			);

			// Renders button group
			expect(form.find(".Form__btns")).toHaveLength(1);
			// Render clear button
			expect(form.find(".Form__btns button")).toHaveLength(1);
			// Renders input submit
			const submitButton = form.find("[type='submit']");
			expect(submitButton.props().value).toEqual("Register");
		});

		test("inputs should be initially blank and handleChange works", () => {
			wrapper.find("[type='text']").forEach((input) => {
				// Ensure inputs are blank
				expect(input.props().value).toEqual("");
			});
			expect(wrapper.find("[type='email']").props().value).toEqual("");

			// Check if handleChange works
			wrapper.find("[type='text']").forEach((input, i) => {
				input.simulate("change", {
					target: { name: inputs[i].name, value: "Test" },
				});
				// Assert change
				expect(wrapper.find("[type='text']").get(i).props.value).toEqual(
					"Test"
				);
			});
			wrapper.find("[type='email']").simulate("change", {
				target: { name: inputs[2].name, value: "test@example.com" },
			});
			expect(wrapper.find("[type='email']").props().value).toEqual(
				"test@example.com"
			);
		});

		test("Clear button works", () => {
			const clearButton = wrapper.find(".Form__btns button");

			// Check if handleChange works
			wrapper.find("[type='text']").forEach((input, i) => {
				input.simulate("change", {
					target: { name: inputs[i].name, value: "Test" },
				});
				// Assert change
				expect(wrapper.find("[type='text']").get(i).props.value).toEqual(
					"Test"
				);
				// Simulate click on clear
				clearButton.simulate("click");
				expect(wrapper.find("[type='text']").get(i).props.value).toBe("");
			});

			// For input email
			wrapper.find("[type='email']").simulate("change", {
				target: { name: inputs[2].name, value: "test@example.com" },
			});
			expect(wrapper.find("[type='email']").props().value).toEqual(
				"test@example.com"
			);
			// Simulate click on clear
			clearButton.simulate("click");
			expect(wrapper.find("[type='email']").props().value).toBe("");
		});

		test("Submit button should call registerUser", () => {
			const registerUserMock = jest.fn();
			const wrapper = setup({
				users: { loading: false, Moderator: true },
				auth: {
					currentUser: { role: "committee" },
				},
				registerUser: registerUserMock,
				initialFormState: {
					firstName: "Test",
					lastName: "Test",
					email: "test@example.com",
				},
			});
			// Simulate submit
			const form = wrapper.find("form");
			form.simulate("submit", { preventDefault() {} });
			expect(registerUserMock.mock.calls.length).toBe(1);
		});
	});
});
