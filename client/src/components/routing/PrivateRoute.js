import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import NewRoute from './NewRoute';
import Spinner from '../utils/Spinner';
import Container from '../layout/Container';

const PrivateRoute = ({
	auth: { isAuthenticated, loading },
	component: Component,
	...rest //refers to exact,path and other props
}) =>
	!isAuthenticated && !loading ? (
		<Redirect to="/login" />
	) : !loading ? (
		<NewRoute {...rest} component={Component} />
	) : (
		<Container>
			<Spinner />
		</Container>
	);
//...rest takes in the rest of the object/ props passed on to component

PrivateRoute.propTypes = {
	auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth
});

export default connect(mapStateToProps)(PrivateRoute);
