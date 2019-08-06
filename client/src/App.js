import React from 'react';
import { Provider } from 'react-redux';
import store from './store';
import Navbar from './components/layout/Navbar';
import Container from './components/layout/Container';
import Routes from './components/routing/Routes';
import './styles/main.scss';

const App = () => {
	return (
		<Provider store={store}>
			<Navbar />
			<Container>
				<Routes />
			</Container>
		</Provider>
	);
};

export default App;
