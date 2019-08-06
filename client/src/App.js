import React from 'react';
import { Provider } from 'react-redux';
import store from './store';
import NewRoute from './components/routing/NewRoute';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Container from './components/layout/Container';
import Routes from './components/routing/Routes';
import Alert from './components/layout/Alert';
import './styles/main.scss';

const App = () => {
	return (
		<Provider store={store}>
			<Navbar />
			<NewRoute exact path="/" component={Landing} />
			<Container>
				<Alert />
				<Routes />
			</Container>
		</Provider>
	);
};

export default App;
