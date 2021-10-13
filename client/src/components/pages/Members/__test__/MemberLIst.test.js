
import React from "react";
import { BrowserRouter } from "react-router-dom";
import renderer from 'react-test-renderer';
import { shallow } from "enzyme";
import { createBrowserHistory } from "history";
import { getAllUsers,deActivateUser,activateUser,changeRole } from "../../../../actions/users";
import { setAlert,resetAlert } from "../../../../actions/alerts";
import MemberListRouter, {MemberList} from "../MemberList";


const history = createBrowserHistory();
jest.spyOn(history, "push");

const initialProps = {
    users:{ users:[{
                _id: "test",
                 firstName: "test",
            }
        ],
        loading: false,
        Moderator: false
    },
    auth: {
        currentUser: {
            active: true,
            role: "user",
            _id: "test",
            firstName: "test",
            lastName: "test",
           email:"user@test.com"
            
    }},
    getAllUsers,
    deActivateUser,
    activateUser,
    setAlert,
    resetAlert,
    changeRole
}

const setup = (props = {}) => {
	const setupProps = { ...initialProps, ...props };
	return shallow(<MemberList {...setupProps} />);
};

test('render MemberList component', () => {
    const wrapper = setup();
    expect(wrapper.find(".MemberList").length).toBe(1)
})

test("Snapshot renders correctly", () => {
	const tree = renderer
		.create(<BrowserRouter><MemberListRouter {...initialProps} /></BrowserRouter>)
		.toJSON();
	expect(tree).toMatchSnapshot()

})

test('should render spinner if loading is true', () => {
    const wrapper = setup({ loading: true });
    expect(wrapper.find(".MemberList").length).toBe(0)
    expect(wrapper.contains(<Spinner />)).toBe(true)
})
