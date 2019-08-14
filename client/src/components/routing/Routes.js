import React from 'react';
import { Switch } from 'react-router-dom';
import NewRoute from './NewRoute';
import Register from '../auth/Register';
import Login from '../auth/Login';
import MemberList from '../pages/Members/MemberList';
import Dashboard from '../pages/Dashboard/Dashboard';
import Discussion from '../pages/Discussion/Discussion';
import Post from '../pages/Discussion/Post/Post';

const Routes = () => {
	return (
		<Switch>
			<NewRoute exact path="/register" component={Register} />
			<NewRoute exact path="/login" component={Login} />
			<NewRoute exact path="/members" component={MemberList} />
			<NewRoute exact path="/discussion" component={Discussion} />
			<NewRoute exact path="/dashboard" component={Dashboard} />
			<NewRoute exact path="/discussion/post/:postId" component={Post} />
		</Switch>
	);
};

export default Routes;

// dashboard
// members list
// Request a speech
// Request a role
// Discussion
// Comment
// Admin and comittee roles --- registering a user and deactivating account
