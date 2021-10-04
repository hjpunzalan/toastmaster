
import React from "react";
import { shallow } from "enzyme";
import { createBrowserHistory } from "history";
import { getAllUsers } from "../../../../actions/users";
import MemberList from "../MemberList";


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
    getAllUsers
}

const setup = (props = {}) => {
	const setupProps = { ...initialProps, ...props };
	return shallow(<MemberList {...setupProps} />);
};




