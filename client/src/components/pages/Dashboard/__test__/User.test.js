import React from "react";
import { shallow } from "enzyme";
import { User } from "../User";
import { createBrowserHistory } from "history";


const history = createBrowserHistory();
jest.spyOn(history, "push");

const initialProps = {
        currentUser: {
        _id: "test",
        firstName: "test",
        }, isModified: false
}

const setup = (props = {}) => {
	const setupProps = { ...initialProps, ...props };
	return shallow(<User {...setupProps} />);
};


test('render dashboard right/ User component', () => {
    const wrapper = setup();
    expect(wrapper.find(".Dashboard__right").length).toBe(1)
})