import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import store from './store';
import { Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';

import Footer from './components/layout/Footer';
import Routes from './components/routing/Routes';
import './styles/main.scss';
import { checkUser } from './actions/auth';

const App = () => {
	useEffect(() => {
		store.dispatch(checkUser()); // runs only once
	}, []);
	return (
		<Provider store={store}>
			<Navbar />
			<Route exact path="/" component={Landing} />
			<Routes />
			<Footer />
		</Provider>
	);
};

export default App;
