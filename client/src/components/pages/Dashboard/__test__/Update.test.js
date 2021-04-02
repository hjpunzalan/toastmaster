import React from "react";
import { shallow } from "enzyme";
import { updateMe } from "../../../../actions/users";
import { Update } from "../Update";
import { createBrowserHistory } from "history";


const history = createBrowserHistory();
jest.spyOn(history, "push");

const initialProps = {
    auth: {
        currentUser: {
            _id: "test"
        }
    }, updateMe, history 
}

const setup = (props = {}) => {
	const setupProps = { ...initialProps, ...props };
	return shallow(<Update {...setupProps} />);
};


test('render form', () => {
    const wrapper = setup();
    expect(wrapper.find(".Form").length).toBe(1)
})

test('render cancel button and on-click works', () => {
    const wrapper = setup()
    const cancelButton = wrapper.find(".Form__goBack")
    expect(cancelButton.length).toBe(1);
    cancelButton.simulate("click");
    expect(history.push).toHaveBeenCalledWith("/dashboard");
})

