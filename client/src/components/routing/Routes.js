import React from 'react';
import { Switch } from 'react-router-dom';
import NewRoute from './NewRoute';
import Register from '../auth/Register';
import Login from '../auth/Login';

const Routes = ({ resetAlert }) => {
	return (
		<Switch>
			<NewRoute exact path="/register" component={Register} />
			<NewRoute exact path="/login" component={Login} />
		</Switch>
	);
};

export default Routes;
