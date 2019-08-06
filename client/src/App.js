import React from 'react';
import { Provider } from 'react-redux';
import store from './store';
import { Switch, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Container from './components/layout/Container';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Alert from './components/layout/Alert';
import './styles/main.scss';

const App = () => {
	return (
		<Provider store={store}>
			<Navbar />
			<Container>
				<Alert />
				<Switch>
					<Route exact path="/register" component={Register} />
					<Route exact path="/login" component={Login} />
				</Switch>
			</Container>
		</Provider>
	);
};

export default App;
