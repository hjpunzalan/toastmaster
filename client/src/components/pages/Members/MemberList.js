import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
	getAllUsers,
	deActivateUser,
	activateUser,
	changeRole
} from '../../../actions/users';
import { setAlert, resetAlert } from '../../../actions/alerts';
import Spinner from '../../utils/Spinner';
import Table from './Table';
import SmallList from './SmallList';

const MemberList = ({
	getAllUsers,
	users: { users, loading, Moderator },
	auth: { currentUser },
	deActivateUser,
	activateUser,
	setAlert,
	resetAlert,
	changeRole
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
			{/* // window.screen.width doesnt take into account the landscape of phone and thus wont rerender, better to use css */}
			<Table
				Moderator={Moderator}
				users={active ? activeUsers : unActiveUsers}
				active={active}
				deActivateUser={deActivateUser}
				activateUser={activateUser}
				currentUser={currentUser}
				setActive={setActive}
				setAlert={setAlert}
				resetAlert={resetAlert}
				changeRole={changeRole}
			/>
			<SmallList
				className="MemberList__smallList"
				Moderator={Moderator}
				users={active ? activeUsers : unActiveUsers}
				active={active}
				deActivateUser={deActivateUser}
				activateUser={activateUser}
				currentUser={currentUser}
				setActive={setActive}
				setAlert={setAlert}
				resetAlert={resetAlert}
				changeRole={changeRole}
			/>
		</div>
	);
};

MemberList.propTypes = {
	getAllUsers: PropTypes.func.isRequired,
	users: PropTypes.object.isRequired,
	deActivateUser: PropTypes.func.isRequired,
	activateUser: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	setAlert: PropTypes.func.isRequired,
	resetAlert: PropTypes.func.isRequired,
	changeRole: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	users: state.users,
	auth: state.auth
});

export default connect(
	mapStateToProps,
	{
		getAllUsers,
		deActivateUser,
		activateUser,
		setAlert,
		resetAlert,
		changeRole
	}
)(MemberList);
