import 'react-app-polyfill/ie9';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'draft-js/dist/Draft.css';
import '@draft-js-plugins/linkify/lib/plugin.css';
import '@draft-js-plugins/image/lib/plugin.css';
import '@draft-js-plugins/focus/lib/plugin.css';

import { BrowserRouter as Router } from 'react-router-dom';

ReactDOM.render(
	<Router>
		<App />
	</Router>,
	document.getElementById('root')
);
