import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
	getAllUsers,
	deActivateUser,
	activateUser
} from '../../../actions/users';
import Table from './Table';
import Spinner from '../../utils/Spinner';

const MemberList = ({
	getAllUsers,
	users: { users, loading, Moderator },
	deActivateUser,
	activateUser
}) => {
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
			<div className="MemberList__top">
				<Link className="MemberList__register" to="/register">
					{Moderator && <button>Register a User</button>}
				</Link>

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
			</div>
			<Table
				Moderator={Moderator}
				users={active ? activeUsers : unActiveUsers}
				active={active}
				deActivateUser={deActivateUser}
				activateUser={activateUser}
			/>
		</div>
	);
};

MemberList.propTypes = {
	getAllUsers: PropTypes.func.isRequired,
	users: PropTypes.object.isRequired,
	deActivateUser: PropTypes.func.isRequired,
	activateUser: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	users: state.users
});

export default connect(
	mapStateToProps,
	{ getAllUsers, deActivateUser, activateUser }
)(MemberList);
