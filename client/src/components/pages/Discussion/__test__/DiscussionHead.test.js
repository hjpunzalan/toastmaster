import React from "react";
import { shallow } from "enzyme";
import { createBrowserHistory } from "history";
import { FaPlusCircle } from "react-icons/fa";
import {
	getAllPost,
	createPost,
	toggleCreatePost,
	searchPost,
} from "../../../../actions/post";
import { onChange } from "../../../../actions/textEditor";
import { DiscussionHead } from "../DiscussionHead";
import ContentEditorConnected, {ContentEditor} from "../../../utils/ContentEditor";


const history = createBrowserHistory();
jest.spyOn(history, "push");

// Set state calls from parent
const setPageMock = jest.fn()
const setIsSearchMock = jest.fn()

const initialProps = {
    loading: false,
    edit: false,
    setPage: setPageMock,
    setIsSearch: setIsSearchMock,
    getAllPost,
	contentState: {},
	createPost,
	toggleCreatePost,
	history,
	searchPost,
}


const setup = (props = {}) => {
	const setupProps = { ...initialProps, ...props };
	return shallow(<DiscussionHead {...setupProps} />);
};

test('render Discussion head component', () => {
    const wrapper = setup();
    expect(wrapper.find(".Discussion__head").length).toBe(1)
})

	test('render Discussion create button and click action calls toggleCreatePost', () => {
	const toggleCreatePostMock = jest.fn()
	const wrapper = setup({toggleCreatePost: toggleCreatePostMock});
	const discussionCreateBtn = wrapper.find(".btn.btn__submit.Discussion__create")
		expect(discussionCreateBtn.length).toBe(1)
		
	discussionCreateBtn.simulate("click")
		expect(toggleCreatePostMock.mock.calls.length).toBe(1);
	})
	
	test('create post button for smaller screens should call toggleCreatePost', () => {
		const toggleCreatePostMock = jest.fn()
		const wrapper = setup({ toggleCreatePost: toggleCreatePostMock });
		wrapper.find(FaPlusCircle).simulate("click");
		expect(toggleCreatePostMock.mock.calls.length).toBe(1);

	})
	
	
	describe('render Discussion editor when edit is true', () => {
		const toggleCreatePostMock = jest.fn()
		const wrapper = setup({ edit: true, toggleCreatePost: toggleCreatePostMock });
		const discussionEditor = wrapper.find(".Discussion__editor");

		// ContentEditor wrapper
		const contentEditorProps =discussionEditor.find(ContentEditorConnected).props();
		const contentEditorWrapper = shallow(<ContentEditor {...contentEditorProps} onChange={onChange}/>)

		test('should change input title then handle toggle should reset title and call handle toggle', () => {
			// Test contentEditor component with discussion head parent props
			// Change text
			contentEditorWrapper.find("#title").simulate("change",
				{ target: { value: "test typing" } })
			expect(wrapper.find(ContentEditorConnected).props().title).toBe("test typing")
			// Handle toggle shoulpd reset title and call toggleCreatePost
			contentEditorWrapper.find(".btn__cancel").simulate("click")
			expect(wrapper.find(ContentEditorConnected).props().title).toBe("")
			expect(toggleCreatePostMock.mock.calls.length).toBe(1);
		})
		
		
	})

