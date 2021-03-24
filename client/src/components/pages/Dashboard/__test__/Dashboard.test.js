import React from "react";
import { shallow } from "enzyme";
import { Announcements } from "../Announcements";
import { Dashboard } from "../Dashboard";
import { User } from "../User";
import {
	getAnnouncements,
} from "../../../../actions/announcements";




const initialProps = {
    auth: {
        currentUser: {
        _id: "test"
    }, isModified: false },
	announcements: { loading: false, edit: false },
	getAnnouncements
}

// Setup function that returns wrapper
const setup = (props = {}) => {
	const setupProps = { ...initialProps, ...props };
	return shallow(<Dashboard {...setupProps} />);
};
