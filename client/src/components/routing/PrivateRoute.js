import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import NewRoute from './NewRoute';
import Spinner from '../utils/Spinner';
import Container from '../layout/Container';
import { logoutUser } from '../../actions/auth';

const PrivateRoute = ({
	auth: { isAuthenticated, currentUser, loading },
	component: Component,
	logoutUser,
	...rest //refers to exact,path and other props
}) => {
	useEffect(() => {
		// if unactive user is logged in
		if (currentUser && !currentUser.active) logoutUser();
		// eslint-disable-next-line
	}, []);

	return !isAuthenticated && !loading ? (
		<Redirect to="/login" />
	) : !loading ? (
		<NewRoute {...rest} component={Component} />
	) : (
		<Container>
			<Spinner />
		</Container>
	);
};
//...rest takes in the rest of the object/ props passed on to component

PrivateRoute.propTypes = {
	auth: PropTypes.object.isRequired,
	logoutUser: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth
});

export default connect(
	mapStateToProps,
	{ logoutUser }
)(PrivateRoute);
