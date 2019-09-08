import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Announcements from './Announcements';
import User from './User';

const Dashboard = ({ auth: { currentUser, isModified } }) => {
	return (
		<div className="Dashboard">
			<Announcements />
			<User currentUser={currentUser} isModified={isModified} />
		</div>
	);
};
Dashboard.propTypes = {
	auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth
});
export default connect(mapStateToProps)(Dashboard);
