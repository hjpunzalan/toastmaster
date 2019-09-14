
<h1>This is an App for my Public Speaking club of around 20 members.</h1>
It is a member club with a dashboard, discussion board, speech posts and member list.
<br>

This is a mern stack app with a following extra technologies:

<ul>
<li>Redux - for global state management (useful in keeping track of editor state)</li>
<li>Draft.js - editor made by facebook especially made for react apps</li>
<li>SASS - CSS preprocessor which is very handy that includes mixins and variables</li>
 <li>AWS S3 - A scalable microservice used for uploading photos.</li>
</ul>

<i><h2>Journal</h2></i>
I've studied web development through online courses and other resources which led me this far on creating a project on my own. I've considered many things back-end such as security, scalability( although only an app for 20 members) and performance.
As for front-end, I've considered performance, design but mostly functionality. I tried focusing more on user experience. What is more functional and what a user would want to see in the best of my ability.
This is still under construction and I am nearing in the end of the completion of the discussion/post page.

<h3>27th August 2019 </h3>
<p>I've completed today the post page client-side pagination( I don't expect a lot of comments from a post so the AJAX request wont be big). I've already added the handlers for the buttons and editor handling.
The pagination was hard at first as I was deciding between client-side vs server side. I decided to do client side for the comments and server-side for the post as there may in the future be  a lot of post but I am expecting minimal comments per post.
Thinking about the user pagination, I had to consider redirecting when adding or deleting comments. Routing invalid page routes by query through location.search from react router was troublesome.
There may have been a simpler way such as using params but this was a challenge which I was happy to take. Any invalid page query are now to be redirected.

The page buttons also only shows when there are three or more comments. I've chosen this design because of simplicity as that I am not expecting many comments per post (20 members).

I am hoping to implement sticky post, search functionality, pagination in discussion and protected routes in the near future.
</p>

<hr/>
<h3>1st September 2019 </h3>
<p>
I've completed most of my goals. I've added pagination of both client and server side using skip and limit in mongoose. I've also added redirections when deleting and adding comments that makes user experience much smoother and interactive. When submitting and updating posts, I added a spinner in between request which makes loading time more interactive. I've connected client-side pagination with router and location of url that responds accordinly from page query.
  
  Searching of post was also added. A user may type a key word relating to the post title or content and submitting this will render a list of post that includes the keyword. I have decided not to use index here because text index only corresponds to word keywords and not down to each letter which affects user experience. I've decided to use a find query that searches all documents of the Post collection querying a search on the content and title that includes a regular expression of the search text. This required creating a plainText property for each post. Thankfully, draft.js editor has a method which converts contentState to plainText. I was able to add this method to each handleSubmit and essentially to each post created or updated. Therefore, every post will have their own plainText.
 
 Lastly, I've added user authentication into the application. Since it was decided to use cookies to send JWT tokens to the client from the server, cookies are only accessible via http request only. This is to protect any malicious injections into the app giving access to the public. I believe this is good practice. The problem with this approach is that the client will need to send request every time a user logs out or verify whether a user is logged in already.
 
 User level authenticated has now been implemented and added to the post authorization when editing and deleting posts.
 
 My next step is to add private routes in the future (I want it public for now to make things easier to see), image file upload using AWS S3 (that is scalable and fast), complete dashboard (only profile edit part and not announcement), complete members page and completing forms to request for speech spot or role using nodemailer.
</p>

<hr/>
<h3>3rd September 2019 </h3>
<p>
  Today I completed the toggle Update Me part of the project. I have now added a scalable solution of file upload using AWS S3 into the application. I made it so each user has their own folder that is able to update their profile photo. Maybe in the future I will add this into the whole application but since this is a learning project, I've decided to postpone this idea so that I continue finishing this project. I chose this solution instead of directly adding to the database or file drive because its a scalable solution. Firstly, it is a cheaper solution than using a database, secondly it is almost serverless that does not require storing the file into the server hence its a very fast and scalable solution. However, it prevents us from editing the file before upload and applying performance optimization middlewares. The only solution is to use a serverless function known as AWS Lambda which will be studied later on the project. The focus of the project is to complete it, study more concepts and finally finalize it.
  
 Private routes were also added. I added redirections to Login if the user is already authenticated. To make the transition smoother, I've added a spinner in at initial state when loading is true. Layout was improved by adding the container component. Error handling however when entering a private route unauthorized need working on. The solution I've come up with now is send error with "Only registered users can log in" when redirected to the login page.
 
 There are still many things I need to do to complete this project such as image resize upon request and send emails, highlighting unread post and unhighliting if read. Highlighting it if a new comment is also added. Highlighting it will also bring it to the top of the list.
 
 At the moment I will focus on completing the members page and then adding email functionality using send grid and nodemailer. Later on I will fix the discussion page.
 
 

</p>
<hr/>
<h3>10th September 2019 </h3>
<p>
  I have been working 12-hr shifts but still managed to be productive. I did a lot of things which I probably should have documented as I went through them but its hard battling against time and you just want to be as productive as much as possible. Looking from my github commits, I did a lot of styling: from changing the colour of the navbar, removing the footer to making the dashboard responsive. Anyhow, lets start with my goals from last time:
  <li>Member-list was semi-completed because I decided I will add another component for unactive users for everyone to access. This is so it makes sense for everyone to see all the old posts of unactive members. The admin and committee will have access to reactivating these members</li>
    <li>I added email functionality using nodemailer and sendGrid. I used nodemailer to allow me to test SMTP request with mailtrap during development. Sadly, I had learn .pug templating which added more time to my development learning. I rushed through the process and tested it with a real email. It works. Emails are sent for forgetting passwords and registering new users.</li>
  <li>I fixed the functionality of searching in discussion page. The error I found was queries aren't being handled into resulting the expected posts. The reason for this that its case-sensitive. I added the option of ignoring case sensitivity and fixed the issue.</li>


 Since its been a week, there's a lot more that I managed to complete. One error I found yesterday was errors in the text editor. There were warnings coming from the linkify plugin and I had to add a handler before the inputs to fix the errors in the links. I had to also fix the attribute error which draft.js-plugin didn't account for.


 I've also improved the sorting of the posts, now based on posted date and last comment made. I think this makes more sense rather than a descending order of posted date. It makes more sense users see, whats being discussed recently and others thats not that important get behind newest posts. Deleting a comment will revert its position from the list. I've labeled this document state as lastComment which could probably use a better name.


  I decided to remove the footer!! The application doesn't need a footer since I decided it won't have a landing page because this app will be a members only app. This improves styling and overall layout which some people might argue otherwise but take a look at facebook. It looks alright doesn't it?


  I've added a moderator toggle bar. Admin or committee members may now toggle the view from user to moderator. This an app-level component underneath the navbar. However, I couldn't access a dynamic state at app level without getting too complicated. I decided to access state from the component to render if the user is not a normal user. I also had to add an effect to set the toggle state to initial as currentUser logs in or out because it would persist otherwise.


  I almost finished the dashboard! I just need to add creating announcements and editing them. I added the embedded facebook post which can by dynamic using ajax request with facebook's graph api and setting the postId to the newest one from the response. The problem is I need to contact the president of my club to have access to the facebook account. Since this is in development mode, I will do so when its required. I've added infinite scroll without a scroll bar in announcements which makes it so much more visually appealing. The scrollbar in my opionion ruins the looks!


  
 Thats it I think! (I also did a lot of refactoring of styles and components) Now I am trying to finish off the dashboard announcements section and then finish the member's list then lastly, the moderator's access only functionalities. The end is near but still many things to do!!! I somehow keep finding more work to do as I go! My goal is to have this deployed by the end of the month -latest.
 
</p>
<hr/>
<h3>13th September 2019 </h3>

<p>
Applications is nearly finished but still got a few things left to do. Lets take a look back on what I've done in the past few days. I've completed redesigning the dashboard to be responsive with the textEditor. All CRUD operations of the announcements were also completed, rendering when in moderator access mode. I've made the textEditor more dynamic able to be used throughout the app even when editting existing posts however, there were a couple of issues such as closure memory leak from the editor. I fixed it through refactoring and adding a conditional operator.
 
 I've also completed the member list. The active and unactive members are in separate tables. I've decided to make the unactive members visible to everyone because when they are deleted/deactivated, I want users to still the posts and comments they have made for reference. Only the admin or moderator are able to see the unactive user's email. In moderator view mode, committee and admin are able to reactivate or deactivate the members. When then the members are deactivated, they can not log in. If already logged in, they are logged out when trying a different route upon receiving a 403 unauthorized http error when trying to make a request from server. If there are no unactive members, current users won't be able to navigate to the unactive member list since its empty. Only admin are able to change roles of the members. IF a logged in committee has been turned back to a normal user, they won't have access to moderator controls and will receive a 401 forbidden http error which will dispatch logout user. Relogging in the application will remove the moderator switch.
 
I've added moderator access to delete posts and comments but not edit them. I've decided to give admin the only role to be able to do this. There shouldn't be any reason for admin to edit other people's post. If anything, deleting should be enough. Committee members does not need to delete post or comments. This is a admin-level responsibility and as committee members, it is not fair to give them the responsiblity.
 
I have done all of this connecting to redux store only from parent component. Passing state down by props to child component. I did it this way so the parent component can be a reference to all the state and actions being passed through it.

Lastly, I've added the registration form page that is only visible to the committee or admin. I still need to program its request and its handlers. I need to also add a redirect to a password change page (which I need to add) for new users only.

After that, is making everything responsive!!! Then tada! Making it responsive will probably take a lot of work. Plus I feel like I will come across a few errors on the way but they key is that I am still moving forward.
 </p>



