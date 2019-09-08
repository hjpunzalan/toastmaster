import React from 'react';
import { Link } from 'react-router-dom';
import img from '../../../img/anonymous.png';

const User = ({ currentUser, isModified }) => {
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
			<p className="Dashboard__user">Hi {currentUser.firstName}!</p>
			<div className="Dashboard__links">
				<Link to="/user/update" className="Dashboard__link">
					Update Profile
				</Link>
				<Link className="Dashboard__link">Change Password</Link>
			</div>
		</div>
	);
};

export default User;
