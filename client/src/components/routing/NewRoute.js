import React from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { resetAlert } from '../../actions/alerts';
import Container from '../layout/Container';
import Alert from '../layout/Alert';

const NewRoute = ({ resetAlert, component: Component, ...rest }) => {
	//
	//
	// Added resetAlert here so whenever component is rendered, it removes existing Alerts.
	return (
		<Route
			{...rest}
			render={props => (
				<Container>
					{resetAlert()}
					<Alert />
					<Component {...props} />
				</Container>
			)}
		/>
	);
};

NewRoute.propTypes = {
	resetAlert: PropTypes.func.isRequired
};

export default connect(
	null,
	{ resetAlert }
)(NewRoute);
