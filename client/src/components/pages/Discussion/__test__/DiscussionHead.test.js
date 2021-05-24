import React from "react";
import { shallow } from "enzyme";
import { createBrowserHistory } from "history";
import {
	getAllPost,
	createPost,
	toggleCreatePost,
	searchPost,
} from "../../../../actions/post";
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

describe('Handle toggle', () => {
	let handleToggle;


	test('render Discussion create button and click action calls handleToggle', () => {
	const toggleCreatePostMock = jest.fn()
	const wrapper = setup({toggleCreatePost: toggleCreatePostMock});
	const discussionCreateBtn = wrapper.find(".btn.btn__submit.Discussion__create")
	expect(discussionCreateBtn.length).toBe(1)
	// Set handle toggle and should be in sync with content editor
	handleToggle = discussionCreateBtn.props().onClick;
	discussionCreateBtn.simulate("click")
	expect(toggleCreatePostMock.mock.calls.length).toBe(1);
	})
	
	describe('render Discussion editor when edit is true', () => {
		const wrapper = setup({ edit: true });
		const discussionEditor = wrapper.find(".Discussion__editor");
		expect(discussionEditor.length).toBe(1);

		// ContentEditor wrapper
		const contentEditorProps =discussionEditor.find(ContentEditorConnected).props();
		const contentEditorWrapper = shallow(<ContentEditor {...contentEditorProps} />)

		test('should change input title then handle toggle should reset title and call handle toggle', () => {
			// Change text
			contentEditorWrapper.find("#title").simulate("change",
				{ target: { value: "test typing" } })
			expect(wrapper.find(ContentEditorConnected).props().title).toBe("test typing")

		})
		
		
	})
	

})
