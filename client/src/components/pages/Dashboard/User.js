import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserAlt, FaKey } from 'react-icons/fa';
import img from '../../../img/anonymous.png';

export const User = ({ currentUser, isModified }) => {
	// IGNORES browser image caching when timestamp added
	// Only required for user component
	const newImageSrc = `${currentUser.photo}?` + Date.now();
	return (
		<div className="Dashboard__right">
			{currentUser.photo ? (
				<img
					className="Dashboard__user-photo"
					src={isModified ? newImageSrc : currentUser.photo}
					alt="user avatar"
				/>
			) : (
				<img className="Dashboard__user-photo" src={img} alt="user avatar" />
			)}
			<div className="Dashboard__user-details">
				<p className="Dashboard__user-name">
					Hi <strong>{currentUser.firstName}</strong>
				</p>
				<div className="Dashboard__links">
					<Link to="/user/update" className="Dashboard__links-link">
						<FaUserAlt />{' '}
						<span>Update Profile</span>
					</Link>
					<Link to="/user/changepassword" className="Dashboard__links-link">
						<FaKey />{' '}
						<span>Change Password</span>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default User;
