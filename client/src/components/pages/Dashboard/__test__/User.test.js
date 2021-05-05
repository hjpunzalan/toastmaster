import React from "react";
import { shallow } from "enzyme";
import { User } from "../User";
import { createBrowserHistory } from "history";
import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";


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

describe('render user photo', () => {
    test('render default photo', () => {
        const wrapper = setup();
        expect(wrapper.find(".Dashboard__user-photo").length).toBe(1)
        expect(wrapper.find(".Dashboard__user-photo").props().src).toBe("anonymous.png")
    })
    test("render uploaded photo", () => {
        const wrapper = setup({
            currentUser: {
               photo: "user.png"
           }});
        expect(wrapper.find(".Dashboard__user-photo").length).toBe(1)
        expect(wrapper.find(".Dashboard__user-photo").props().src).toBe("user.png")
    })
    
})
