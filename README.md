
# Toastmaster members platform
> This is a MERN stack App for my Public Speaking club of around 20 members.

### Demo
Try it out https://srtoastmasters.herokuapp.com/ <br>
email: user@<span>test.com</span>\
password: toastmaster

## Table of contents
* [General info](#general-info)
* [Challenges](#challenges)
* [Screenshots](#screenshots)
* [Technologies](#technologies)
* [Setup](#setup)

## General info
This app was inspired by my toastmaster club (Southern River Toastmasters). Most club under the same organisation consist of around 15-30 members. The club heirarchy consist of members, a committee and a club president. This is an online discussion board specifically made to allow club members to communicate to each other (ie sharing speeches and evaluations). Most clubs have their own landing page but currently no local clubs have a members platform.

### Features
- All club members are able to share a post that can be commented on.
- Search bar for posts by keyword.
- Committee-only access to posting/deleting announcements that can be seen by everyone.
- User/Committee level view to control club user actions.
- Ability to deactivate/reactivate club members.
- Committee only access to registering new users.

## Challenges
This is the first web application I have created from scratch. I have borrowed knowledge and experience from online courses to create this. I wanted it to be created with quality and able to be deployed for production. With these in mind I faced the following challenges:
- Security (eg. JWT stored within cookies)
- Scalability - although the capacity of the club tends to be low, I have to consider the potential of multiple photo uploads through versioning and thousands of post to be uploaded.
- Draft.js - unique architecture caused difficulty to share the same context from editor to state and database.
- Authentication - application has low-level security risk however it still has to consider potential unauthorised logins (expiring current sessions when password is changed)
- State Concurrency - sending api request usually takes time and to maintain a pleasant UX its important to concurrently handle state changes especially during loading times.
- Client-side vs Server-side pagination - I have decided to utilise server-side pagination for loading posts through an infinite scrolling library and client side for comments. With mongoDB indexing, searching for posts using characters of its text or title was also added.
- Responsive design - unfortunately, draft-js does not support mobile-view so I had to replace it with text-box for smaller screens.
- Authorization - considering expired members are to be deactivated, posts created will need to persist as it can included important contents. Committee members should also not be allowed to edit anyones elses post due to privacy. They can however delete this post if needed.

### Mobile-view
https://user-images.githubusercontent.com/47600145/116561002-7b7b3e00-a934-11eb-8848-3674c6a25857.mp4
<br>
### Desktop-view
https://user-images.githubusercontent.com/47600145/116559812-60f49500-a933-11eb-8b23-dffb4eca7004.mp4
<br>
### Sample welcome email
![mail](https://user-images.githubusercontent.com/47600145/116596561-17b63c80-a957-11eb-8667-62b3acdcefb0.png)
<br><br>


## Technologies
* React - javascript framework/library.
* Redux - for global state management (useful in keeping track of editor state).
* Draft.js - rich text editor made by facebook especially made for react apps.
* Sass - CSS preprocessor with flexbox which is very handy that includes mixins and variables.
* MongoDB - NoSQL database that is easily scalable.
* AWS S3 - scalable microservice used for uploading photos.
* Express.js - popular node.js framework for creating REST api.
* Github actions - continious integration workflow straight deployment to heroku
* SendGrid - unfortunately, sendGrid mail service without a DNS may be blocked by some email providers such as Outlook thus, some features such as forgetting password may not work in the live demo.

To-do list:
* Client-side automated testing still in progress
* Add chatting system
