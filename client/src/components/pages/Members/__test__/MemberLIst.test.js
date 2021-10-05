
import React from "react";
import { shallow } from "enzyme";
import { createBrowserHistory } from "history";
import { getAllUsers,deActivateUser,activateUser,changeRole } from "../../../../actions/users";
import { setAlert,resetAlert } from "../../../../actions/alerts";
import {MemberList} from "../MemberList";


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


