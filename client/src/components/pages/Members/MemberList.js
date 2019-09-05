import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getAllUsers } from '../../../actions/users';
import img from '../../../img/anonymous.png';
import { MdEmail } from 'react-icons/md';

const MemberList = ({ getAllUsers, users: { users } }) => {
	useEffect(() => {
		getAllUsers();
		//eslint-disable-next-line
	}, []);
	return (
		<div className="MemberList">
			<h1 className="MemberList__title">Member List</h1>
			<hr />
			{users.map(user => (
				<div className="MemberList__member">
					<img
						className="MemberList__member-photo"
						src={user.photo || img}
						alt="user avatar"
					/>
					<span className="MemberList__member-name">
						{user.firstName} {user.lastName}
					</span>
					<span style={{ display: 'flex', alignItems: 'center' }}>
						<a
							href={`mailto:${user.email}`}
							target="_top"
							className="MemberList__member-email">
							<MdEmail />
						</a>
						{user.email}
					</span>
				</div>
			))}
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
