import React from 'react';
import { Switch } from 'react-router-dom';
import NewRoute from './NewRoute';
import Register from '../auth/Register';
import Login from '../auth/Login';
import MemberList from '../pages/MemberList';

const Routes = ({ resetAlert }) => {
	return (
		<Switch>
			<NewRoute exact path="/register" component={Register} />
			<NewRoute exact path="/login" component={Login} />
			<NewRoute exact path="/members" component={MemberList} />
		</Switch>
	);
};

export default Routes;
