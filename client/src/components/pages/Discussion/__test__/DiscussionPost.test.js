
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { shallow } from "enzyme";
import renderer from 'react-test-renderer';
import { createBrowserHistory } from "history";
import DiscussionPostRouter, {DiscussionPost} from "../DiscussionPost";



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

test('render Discussion post ', () => {
    const wrapper = setup();
    expect(wrapper.find(".Discussion__post").length).toBe(1)
})


test("Snapshot renders correctly", () => {
	const tree = renderer
		.create(<BrowserRouter><DiscussionPostRouter {...initialProps} /></BrowserRouter>)
		.toJSON();
	expect(tree).toMatchSnapshot()

})



