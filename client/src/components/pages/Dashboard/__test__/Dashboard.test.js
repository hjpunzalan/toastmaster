import React from "react";
import { shallow } from "enzyme";
import Announcements from '../Announcements';
import { Dashboard } from "../Dashboard";
import  User  from "../User";
import Spinner from '../../../utils/Spinner';
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

test('should get all announcements', () => {
	const getAnnouncementsMock = jest.fn()
	setup({ getAnnouncements: getAnnouncementsMock });
	expect(getAnnouncementsMock).toHaveBeenCalled()
})

test('if loading is true, render spinner', () => {
	const wrapper = setup({ announcements: { loading: true } })
	expect(wrapper.contains(<Spinner />)).toBe(true)
})

test('render announcements if loading is false', () => {
	const wrapper = setup()
	expect(wrapper.find(".Dashboard").containsMatchingElement(<Announcements />)).toBe(true)
})

test('renders user if announcements is not on edit mode', () => {
	const wrapper = setup({
		auth: {
			currentUser: { _id: "test" },
			isModified: false
	},
		announcements: { edit: false }
	})
	expect(wrapper.find(".Dashboard").containsMatchingElement(<User />)).toBe(true)
	expect(wrapper.find("User").props()).toEqual({ currentUser: { _id: 'test' }, isModified: false })
})




