
import React from "react";
import { shallow } from "enzyme";
import renderer from 'react-test-renderer';
import { Discussion } from "../Discussion";
import { createBrowserHistory } from "history";
import {
	getAllPost,
	createPost,
	toggleCreatePost,
	searchPost,
	postNextPage,
} from "../../../../actions/post";
import {DiscussionPost} from "../DiscussionPost";



const history = createBrowserHistory();
jest.spyOn(history, "push");

const initialProps = {
	img: "imgurl",
	count: 5,
	id: "test",
	title:"title",
	date:"2019-09-21T17:45:46.965Z",
	text: "test post",
	firstName: "firstname",
	lastName:"lastName"
}

const setup = (props = {}) => {
	const setupProps = { ...initialProps, ...props };
	return shallow(<DiscussionPost {...setupProps} />);
};

test('render Discussion post component', () => {
    const wrapper = setup();
    expect(wrapper.find(".Discussion__post").length).toBe(1)
})


test("Snapshot renders correctly", () => {
	const tree = renderer.create(DiscussionPost).toJSON();
	expect(tree).toMatchSnapshot()

})



