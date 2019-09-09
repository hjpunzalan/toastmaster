import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import store from './store';
import { Route, Redirect, withRouter } from 'react-router-dom';
import Navbar from './components/layout/Navbar';

import Routes from './components/routing/Routes';
import './styles/main.scss';
import { checkUser } from './actions/auth';
import Moderator from './components/layout/Moderator';

const App = () => {
	useEffect(() => {
		store.dispatch(checkUser()); // runs only once
	}, []);

	return (
		<Provider store={store}>
			<Navbar />
			<Moderator />
			<Route exact path="/" render={() => <Redirect to="/dashboard" />} />
			<Routes />
		</Provider>
	);
};

export default withRouter(App);
