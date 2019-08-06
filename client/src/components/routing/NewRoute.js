import React, { Fragment } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { resetAlert } from '../../actions/alerts';

const NewRoute = ({ resetAlert, component: Component, ...rest }) => {
	//
	//
	// Added resetAlert here so whenever component is rendered, it removes existing Alerts.
	return (
		<Route
			{...rest}
			render={props => (
				<Fragment>
					{resetAlert()}
					<Component {...props} />
				</Fragment>
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
