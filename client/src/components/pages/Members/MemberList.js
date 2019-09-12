import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getAllUsers } from '../../../actions/users';
import Table from './Table';
import Spinner from '../../utils/Spinner';

const MemberList = ({ getAllUsers, users: { users, loading, Moderator } }) => {
	useEffect(() => {
		getAllUsers(active);
		//eslint-disable-next-line
	}, []);

	const [active, setActive] = useState(true);
	const activeUsers = users.filter(user => user.active === true);
	const unActiveUsers = users.filter(user => user.active === false);

	return loading ? (
		<Spinner />
	) : (
		<div className="MemberList">
			<h1 className="MemberList__title">Member List</h1>
			<div className="MemberList__switch">
				<input
					type="radio"
					name="users"
					id="active"
					onChange={() => setActive(!active)}
					checked={active}
				/>
				<label htmlFor="active">Active</label>
				<input
					type="radio"
					name="users"
					id="unactive"
					onChange={() => setActive(!active)}
					checked={!active}
				/>
				<label htmlFor="unactive">Unactive</label>
			</div>
			<Table
				Moderator={Moderator}
				users={active ? activeUsers : unActiveUsers}
				active={active}
			/>
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
