import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getAllUsers } from '../../../actions/users';
import Table from './Table';
import Spinner from '../../utils/Spinner';

const MemberList = ({ getAllUsers, users: { users, loading } }) => {
	useEffect(() => {
		getAllUsers();
		//eslint-disable-next-line
	}, []);
	return loading ? (
		<Spinner />
	) : (
		<div className="MemberList">
			<h1 className="MemberList__title">Member List</h1>
			<Table users={users} />
		</div>
	);
};

MemberList.propTypes = {
	getAllUsers: PropTypes.func.isRequired,
	users: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	users: state.users
});

export default connect(
	mapStateToProps,
	{ getAllUsers }
)(MemberList);
