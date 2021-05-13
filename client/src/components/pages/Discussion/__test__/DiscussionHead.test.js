import React from "react";
import { shallow } from "enzyme";
import { Discussion } from "../Discussion";
import { createBrowserHistory } from "history";
import {
	getAllPost,
	createPost,
	toggleCreatePost,
	searchPost,
	postNextPage,
} from "../../../../actions/post";
import {DiscussionHead} from "../DiscussionHead";


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