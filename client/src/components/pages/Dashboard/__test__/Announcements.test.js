import React from "react";
import { shallow } from "enzyme";
import { Announcements } from "../Announcements";
import {
	toggleEdit,
	createAnnouncement,
	updateAnnouncement,
	deleteAnnouncement,
} from "../../../../actions/announcements";


import ContentEditor from "../../../utils/ContentEditor";

const announcementSample = {
    _id: 'test',
    title: "test",
    contentState: {},
    plainText: "test"
}

const initialProps = {
	users: { Moderator: false },
	toggleEdit,
	createAnnouncement,
	updateAnnouncement,
	deleteAnnouncement,
	announcements: { edit: false, announcements: [announcementSample, announcementSample] },
	textEditor: { contentState: {} },
	alerts: {msg: "alert"} 
}

// Setup function that returns wrapper
const setup = (props = {}) => {
	const setupProps = { ...initialProps, ...props };
	return shallow(<Announcements {...setupProps} />);
};

test('If state is on edit for creating or editing, show content editor', () => {
    const wrapper = setup({ announcements: { edit: true } })
    expect(wrapper.find(".Dashboard__editor").containsMatchingElement(<ContentEditor/>)).toBe(true)
    
})

test('If state is on edit for creating or editing, show content editor', () => {
    const wrapper = setup({ announcements: { edit: true } })
    expect(wrapper.find(".Dashboard__editor").containsMatchingElement(<ContentEditor/>)).toBe(true)
})

test('Display title and create new announcement button if moderator', () => {
	const toggleEditMock = jest.fn()
	const wrapper = setup({users: {Moderator: true}, toggleEdit: toggleEditMock});
	const topLayer = wrapper.find(".Dashboard__left .Dashboard__top")
	// Make sure text is not empty
	expect(topLayer.find(".Dashboard__title").text().length).not.toBe(0)
	// Make sure button exist and has text
	const button = topLayer.find("button.btn__announcement")
	expect(button.length).toBe(1)
	expect(button.text().length).not.toBe(0)

	button.simulate("click")
	expect(toggleEditMock).toHaveBeenCalled()

})
