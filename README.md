# Toastmaster members platform
> This is a MERN stack App for my Public Speaking club of around 20 members.
> Currently adding test using Jest

## Table of contents
* [General info](#general-info)
* [Challenges](#challenges)
* [Screenshots](#screenshots)
* [Technologies](#technologies)
* [Setup](#setup)

## General info
It is a member club with a dashboard, discussion board, speech posts and member list. Its main usage is explicitly for communication purposes within club members. There is a user-level heirarchy consisting of normal users, moderator and admin. Committee members of a toastmaster club typically are able to control user actions and are the only one able to register, activate and deactivate users.

## Challenges
This is the first web application I have created from scratch. I have borrowed knowledge and experience from online courses to create this. I wanted it to be created with quality and able to be deployed for production. With these in mind I faced the following challenges:
- Security (eg. JWT stored within cookies)
- Scalability - although the capacity of the club tends to be low, I have to consider the potential of multiple photo uploads through versioning and thousands of post to be uploaded.
- Draft.js - unique architecture caused difficulty to share the same context from editor to state and database.
- Authentication - application has low-level security risk however it still has to consider potential unauthorised logins (expiring current sessions when password is changed)
- State Concurrency - sending api request usually takes time and to maintain a pleasant UX its important to concurrently handle state changes especially during loading times.
- Client-side vs Server-side pagination - I have decided to utilise server-side pagination for loading posts through an infinite scrolling library and client side for comments. Using mongoDB indexing, searching for posts using characters of its text or title was also added.
- Responsive design - unfortunately, draft-js does not support mobile-view so I had to replace it with text-box for smaller screens.

## Screenshots
![Example screenshot](./img/screenshot.png)

## Technologies
* React - javascript framework/library.
* Redux - for global state management (useful in keeping track of editor state).
* Draft.js - rich text editor made by facebook especially made for react apps.
* Sass - CSS preprocessor with flexbox which is very handy that includes mixins and variables.
* MongoDB - NoSQL database that is easily scalable.
* AWS S3 - A scalable microservice used for uploading photos.
* Express.js - popular node.js framework for creating REST api.

## Setup
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

To-do list:
* Client-side automated testing still in progress
