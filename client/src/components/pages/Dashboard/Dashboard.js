import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Announcements from './Announcements';
import User from './User';
import Spinner from '../../utils/Spinner';
import { getAnnouncements } from '../../../actions/announcements';

const Dashboard = ({
	auth: { currentUser, isModified },
	announcements: { loading },
	getAnnouncements
}) => {
	useEffect(() => {
		getAnnouncements();
		//eslint-disable-next-line
	}, []);

	return loading ? (
		<Spinner />
	) : (
		<div className="Dashboard">
			<Announcements />
			<User currentUser={currentUser} isModified={isModified} />
		</div>
	);
};
Dashboard.propTypes = {
	auth: PropTypes.object.isRequired,
	getAnnouncements: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth,
	announcements: state.announcements
});
export default connect(
	mapStateToProps,
	{ getAnnouncements }
)(Dashboard);
