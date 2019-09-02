
<h1>This is an App for my Public Speaking club of around 20 members.</h1>
It will include a landing page, dashboard, discussion board, speech posts, member list, meeting roles (listing of when members last filled each role)
<br>

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



