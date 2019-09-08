import React from 'react';
import { Switch } from 'react-router-dom';
import NewRoute from './NewRoute';
import PrivateRoute from './PrivateRoute';
import Register from '../auth/Register';
import Login from '../auth/Login';
import MemberList from '../pages/Members/MemberList';
import Dashboard from '../pages/Dashboard/Dashboard';
import Discussion from '../pages/Discussion/Discussion';
import Post from '../pages/Discussion/Post/Post';
import ForgotPassword from '../auth/ForgotPassword';
import ResetPassword from '../auth/ResetPassword';
import Update from '../pages/Dashboard/Update';

const Routes = () => {
	return (
		<Switch>
			<PrivateRoute exact path="/register" component={Register} />
			<NewRoute exact path="/login" component={Login} />
			<NewRoute exact path="/forgotpassword" component={ForgotPassword} />
			<NewRoute
				exact
				path="/forgotpassword/reset/:resetToken"
				component={ResetPassword}
			/>
			<PrivateRoute exact path="/members" component={MemberList} />
			<PrivateRoute exact path="/discussion" component={Discussion} />
			<PrivateRoute exact path="/dashboard" component={Dashboard} />
			<PrivateRoute exact path="/user/update" component={Update} />
			<PrivateRoute exact path="/discussion/post/:postId" component={Post} />
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
