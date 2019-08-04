import React, { Fragment } from 'react';
import { Switch, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Container from './components/layout/Container';
import Register from './components/auth/Register';
import './styles/main.scss';

const App = () => {
	return (
		<Fragment>
			<Navbar />
			<Container>
				<Switch>
					<Route exact path="/register" component={Register} />
				</Switch>
			</Container>
		</Fragment>
	);
};

export default App;
