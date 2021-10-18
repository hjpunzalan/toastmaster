
import React from "react";
import { BrowserRouter } from "react-router-dom";
import renderer from 'react-test-renderer';
import { shallow } from "enzyme";
import { createBrowserHistory } from "history";
import { deActivateUser,activateUser,changeRole } from "../../../../actions/users";
import { Members } from '../Members'


const history = createBrowserHistory();
jest.spyOn(history, "push");

const initialProps = {
    user:{
                _id: "test",
                 firstName: "test",
            }
        ,
        loading: false,
        Moderator: false
    , active: true,
    deActivateUser,
    activateUser,
        currentUser: {
            active: true,
            role: "user",
            _id: "test",
            firstName: "test",
            lastName: "test",
           email:"user@test.com"
            
    },
    changeRole
}

const setup = (props = {}) => {
	const setupProps = { ...initialProps, ...props };
	return shallow(<Members {...setupProps} />);
};

test('render Members component', () => {
    const wrapper = setup();
    expect(wrapper.find(".MemberList__member").length).toBe(1)
})

test("Snapshot renders correctly", () => {
	const tree = renderer
		.create(<BrowserRouter><Members {...initialProps} /></BrowserRouter>)
		.toJSON();
	expect(tree).toMatchSnapshot()

})
