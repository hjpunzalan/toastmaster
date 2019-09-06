import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getAllUsers } from '../../../actions/users';
import img from '../../../img/anonymous.png';
import { MdEmail } from 'react-icons/md';
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
			<table className="MemberList__list">
				<thead>
					<tr>
						<th>Photo</th>
						<th>First Name</th>
						<th>Last Name</th>
						<th>Email</th>
					</tr>
				</thead>
				<tbody>
					{users.map(user => (
						<tr key={user._id} className="MemberList__member">
							<td>
								<img
									className="MemberList__member-photo"
									src={user.photo || img}
									alt="user avatar"
								/>
							</td>
							<td>
								<span className="MemberList__member-name">
									{user.firstName}
								</span>
							</td>
							<td>
								<span className="MemberList__member-name">{user.lastName}</span>
							</td>
							<td>
								<span
									style={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center'
									}}>
									<a
										href={`mailto:${user.email}`}
										target="_top"
										className="MemberList__member-email">
										<MdEmail />
									</a>
									{user.email}
								</span>
							</td>
						</tr>
					))}
				</tbody>
			</table>
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
