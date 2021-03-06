
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
import DiscussionHead from "../DiscussionHead";
import DiscussionPost from "../DiscussionPost";


const history = createBrowserHistory();
jest.spyOn(history, "push");

const initialProps = {
    post: {
        posts: [{
            _id: "test",
            title: "test title",
             user: {
                _id: "test",
                 firstName: "test",
            },
             comments: [{}]
        }],
        edit: false,
        loading: false,
        totalPages: 1
    },
    getAllPost,
	contentState: {},
	createPost,
	toggleCreatePost,
	history,
	searchPost,
	postNextPage,
}

const setup = (props = {}) => {
	const setupProps = { ...initialProps, ...props };
	return shallow(<Discussion {...setupProps} />);
};

test('render Discussion component', () => {
    const wrapper = setup();
    expect(wrapper.find(".Discussion").length).toBe(1)
})
test('render Discussion head component', () => {
    const wrapper = setup();
    
    expect(wrapper.find(".Discussion").containsMatchingElement(
        <DiscussionHead />)).toBe(true)
})

test('render Discussion post', () => {
       const wrapper = setup();
    
    expect(wrapper.find(".Discussion").containsMatchingElement(
        <DiscussionPost />)).toBe(true)
})




