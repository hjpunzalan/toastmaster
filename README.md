
<h1>This is an App for my Public Speaking club of around 20 members.</h1>

This is a mern stack app with a following extra technologies:

<ul>
<li>Redux - for global state management (useful in keeping track of editor state)</li>
<li>Draft.js - editor made by facebook especially made for react apps</li>
<li>SASS - CSS preprocessor which is very handy that includes mixins and variables</li>
</ul>

<i><h2>Journal</h2></i>
I've studied web development through online courses and other resources which led me this far on creating a project on my own. I've considered many things back-end such as security, scalability( although only an app for 20 members) and performance.
As for front-end, I've considered performance, design but mostly functionality. I tried focusing more on user experience. What is more functional and what a user would want to see in the best of my ability.
This is still under construction and I am nearing in the end of the completion of the discussion/post page.

I've completed today the post page client-side pagination( I don't expect a lot of comments from a post so the AJAX request wont be big). I've already added the handlers for the buttons and editor handling.
The pagination was hard at first as I was deciding between client-side vs server side. I decided to do client side for the comments and server-side for the post as there may in the future be  a lot of post but I am expecting minimal comments per post.
Thinking about the user pagination, I had to consider redirecting when adding or deleting comments. Routing invalid page routes by query through location.search from react router was troublesome.
There may have been a simpler way such as using params but this was a challenge which I was happy to take. Any invalid page query are now to be redirected.


