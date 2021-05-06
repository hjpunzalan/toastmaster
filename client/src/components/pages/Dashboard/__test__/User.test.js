import React from "react";
import { shallow } from "enzyme";
import { User } from "../User";

const initialProps = {
        currentUser: {
        _id: "test",
        firstName: "test",
        }, isModified: false
}

const setup = (props = {}) => {
	const setupProps = { ...initialProps, ...props };
	return shallow(<User {...setupProps} />);
};


test('render dashboard right/ User component', () => {
    const wrapper = setup();
    expect(wrapper.find(".Dashboard__right").length).toBe(1)
})

describe('render user photo', () => {
    test('render default photo', () => {
        const wrapper = setup();
        expect(wrapper.find(".Dashboard__user-photo").length).toBe(1)
        expect(wrapper.find(".Dashboard__user-photo").props().src).toBe("anonymous.png")
    })
    test("render uploaded photo", () => {
        const wrapper = setup({
            currentUser: {
               photo: "user.png"
           }});
        expect(wrapper.find(".Dashboard__user-photo").length).toBe(1)
        expect(wrapper.find(".Dashboard__user-photo").props().src).toBe("user.png")
    })
    
})

describe('render user details', () => {
    const wrapper = setup();
    expect(wrapper.find(".Dashboard__user-details").length).toBe(1)
    
    test('display user first name', () => {
        let firstNameFound = false;
        wrapper.find(".Dashboard__user-name").props()
            .children.forEach(el => {
                if (el.props && el.props.children === initialProps.currentUser.firstName) firstNameFound = true;
            })
            expect(firstNameFound).toBe(true)
    })

    test('display links', () => {
        const updateProfileProps = wrapper.find(".Dashboard__links .Dashboard__links-link").get(0).props;
        const changePasswordProps = wrapper.find(".Dashboard__links .Dashboard__links-link").get(1).props
           
        // Check attribute link is correct
        expect(updateProfileProps.to).toBe(("/user/update"))
        expect(changePasswordProps.to).toBe(("/user/changepassword"))

        // Check link keywords are correct
        let updateProfileFound = false;
        let changePasswordFound = false;
        updateProfileProps.children.forEach(el => {
            if (el.props && el.props.children === "Update Profile")
                updateProfileFound = true
        })
          changePasswordProps.children.forEach(el => {
              if (el.props && el.props.children === "Change Password")
                  changePasswordFound = true
          })
        
        expect(updateProfileFound).toBe(true);
        expect(changePasswordFound).toBe(true);
    })
    
})


