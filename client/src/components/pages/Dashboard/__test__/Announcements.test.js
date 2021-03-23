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
import ReadOnly from "../../../utils/draft-js/ReadOnly";


const announcements= [{
    _id: 'test',
    title: "test",
    contentState: {test: "test"},
	plainText: "test",
	date: '1976-04-19T12:59-0500',
	lastEdited: '1977-04-19T12:59-0500'
}, {
    _id: 'test2',
    title: "test2",
    contentState: {test: "test2"},
	plainText: "test2",
	date: '1976-04-19T12:59-0500'
}]

const initialProps = {
	users: { Moderator: false },
	toggleEdit,
	createAnnouncement,
	updateAnnouncement,
	deleteAnnouncement,
	announcements: { edit: false, announcements },
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

	// Expect toggle editor state is on
	button.simulate("click")
	expect(toggleEditMock).toHaveBeenCalled()

})

describe('Display each announcement', () => {
	const wrapper = setup({ announcements: { edit: false, announcements }, })
	const announcementList = wrapper.find(".Dashboard__announcement");

	test('Display the title', () => {
		announcementList.forEach(a => {
			expect(a.find(".Dashboard__announcement-title").text().length).not.toBe(0)
		})
	})
	test('Show contentstate from ReadOnly component', () => {
			announcementList.forEach((a,i) => {
				expect(a.containsMatchingElement(<ReadOnly />)).toBe(true)
				expect(a.find("ReadOnly").props().contentState).toBe(announcements[i].contentState)
		})
	})
	test('Show time and and date at the bottom', () => {
		announcementList.forEach((a, i) => {
			if(announcements[i].lastEdited >announcements[i].date ) expect(a.find(".Dashboard__announcement-bottom t").props().children).toEqual(announcements[i].lastEdited)
			else expect(a.find(".Dashboard__announcement-bottom t").props().children).toEqual(announcements[i].date)
		})
	})

	test('should buttons for moderator only', () => {
			announcementList.forEach((a, i) => {
				expect(a.find(".Dashboard__announcement-buttons").length).toBe(0)
			})
		
		const toggleEditMock = jest.fn()
		const deleteAnnouncementMock = jest.fn()

		const newWrapper = setup({
			deleteAnnouncement: deleteAnnouncementMock,
			toggleEdit: toggleEditMock,
			announcements: { edit: false, announcements },
			users: { Moderator: true },
		})

		const newList = newWrapper.find(".Dashboard__announcement");
		newList.forEach(a => {
			const buttons = a.find(".Dashboard__announcement-buttons")
			expect(buttons.length).toBe(1)

			// Test edit button
			const editButton = buttons.find("button.btn.btn__edit-xs")
			editButton.simulate("click");
			expect(toggleEditMock).toHaveBeenCalled()

			// Test delete button
			const deleteButton = buttons.find("button.btn.btn__delete-xs")
			deleteButton.simulate("click");
			expect(deleteAnnouncementMock).toHaveBeenCalled()

		})
	})


	
	
	
})


