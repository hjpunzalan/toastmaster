import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getAllUsers } from '../../../actions/users';
import img from '../../../img/anonymous.png';

const MemberList = ({ getAllUsers, users: { users } }) => {
	useEffect(() => {
		getAllUsers();
		//eslint-disable-next-line
	}, []);
	return (
		<div className='MemberList'>
			{users.map(user => (
				<div className='MemberList__member'>
					<img src={user.photo || img} alt='user avatar' />
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
