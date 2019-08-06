import React, { Fragment } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Alert from '../layout/Alert';
import { resetAlert } from '../../actions/alerts';

const NewRoute = ({ resetAlert, component: Component, ...rest }) => {
	return (
		<Route
			{...rest}
			render={props => (
				<Fragment>
					{resetAlert()}
					<Alert />
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
