
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
It is a member club with a dashboard, discussion board, speech posts and member list. Dashboard for committee members to communicate to all the club members. Discussion board for communication such as speech reviews for club members. A member list to send emails and for committee members to manage club members.

There is a user-level heirarchy consisting of normal users, moderator and admin. Committee members of a toastmaster club typically are able to control user actions and are the only one able to register, activate and deactivate users.

Unfortunately, sendGrid mail service without a DNS may be blocked by some email providers such as Outlook thus, some features such as forgetting password may not work in the live demo.

## Challenges
This is the first web application I have created from scratch. I have borrowed knowledge and experience from online courses to create this. I wanted it to be created with quality and able to be deployed for production. With these in mind I faced the following challenges:
- Security (eg. JWT stored within cookies)
- Scalability - although the capacity of the club tends to be low, I have to consider the potential of multiple photo uploads through versioning and thousands of post to be uploaded.
- Draft.js - unique architecture caused difficulty to share the same context from editor to state and database.
- Authentication - application has low-level security risk however it still has to consider potential unauthorised logins (expiring current sessions when password is changed)
- State Concurrency - sending api request usually takes time and to maintain a pleasant UX its important to concurrently handle state changes especially during loading times.
- Client-side vs Server-side pagination - I have decided to utilise server-side pagination for loading posts through an infinite scrolling library and client side for comments. With mongoDB indexing, searching for posts using characters of its text or title was also added.
- Responsive design - unfortunately, draft-js does not support mobile-view so I had to replace it with text-box for smaller screens.

### Mobile-view
https://user-images.githubusercontent.com/47600145/116561002-7b7b3e00-a934-11eb-8848-3674c6a25857.mp4

### Desktop-view
https://user-images.githubusercontent.com/47600145/116559812-60f49500-a933-11eb-8b23-dffb4eca7004.mp4

### Sample welcome email
![mail](https://user-images.githubusercontent.com/47600145/116596561-17b63c80-a957-11eb-8667-62b3acdcefb0.png)



## Technologies
* React - javascript framework/library.
* Redux - for global state management (useful in keeping track of editor state).
* Draft.js - rich text editor made by facebook especially made for react apps.
* Sass - CSS preprocessor with flexbox which is very handy that includes mixins and variables.
* MongoDB - NoSQL database that is easily scalable.
* AWS S3 - A scalable microservice used for uploading photos.
* Express.js - popular node.js framework for creating REST api.
* Github actions - continious integration workflow straight deployment to heroku

## Setup
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

1. Clone the repository

```
git clone https://github.com/hjpunzalan/toastmaster.git
```

2. Install project dependencies

```
npm install
cd client
npm install
```

3. Add your personal own configuration at root directory with file named "config.env"
##### THIS FILE IS ADDED TO .gitginore for security purposes
```
NODE_ENV=development
DATABASE=YOUR mongodb url
JWT_SECRET=test
JWT_EXPIRATION=90d
JWT_COOKIE_EXPIRATION=90
EMAIL_FROM=YOUR email
S3_ACCESS_KEY=YOUR AWS S3 ACCESS KEY
S3_SECRET_ACCESS_KEY=YOUR AWS SECRET S3 ACCESS KEY
EMAIL_USERNAME=YOUR MAILTRAP USERNAME
EMAIL_PASSWORD= YOUR MAILTRAP PASSWORD
EMAIL_PORT=25
EMAIL_HOST=smtp.mailtrap.io
```

4. Start the server in development mode

```
npm run dev
```

To-do list:
* Client-side automated testing still in progress
