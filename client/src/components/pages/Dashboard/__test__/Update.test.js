import React from "react";
import { shallow } from "enzyme";
import { updateMe } from "../../../../actions/users";
import { Update } from "../Update";


const history = createBrowserHistory();

const initialProps = {
    auth: {
        currentUser: {
        _id: "test"
    }, updateMe, history }
}

const setup = (props = {}) => {
	const setupProps = { ...initialProps, ...props };
	return shallow(<Update {...setupProps} />);
};
