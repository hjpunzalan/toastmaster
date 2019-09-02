import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import img from '../../../img/anonymous.png';
import useForms from '../../../hooks/useForms';
import { updateMe } from '../../../actions/users';

const Dashboard = ({ auth: { currentUser }, updateMe, history }) => {
	const { firstName, lastName, email } = currentUser;
	const [file, setFile] = useState('');
	const blankForm = { firstName, lastName, email };
	const { formData, handleChange, handleSubmit } = useForms(
		blankForm,
		updateMe,
		file,
		history
	);

	const handleFileChange = e => {
		setFile(e.target.files[0]);
	};
	return (
		<div className="Dashboard">
			<div className="Dashboard__left">
				<h1 className="Dashboard__title">Member's Dashboard</h1>
				<p className="Dashboard__label">
					Here you will find club guidelines and resources available to its
					members.
				</p>
				<hr />
			</div>
			<div className="Dashboard__right">
				{currentUser.photo ? (
					<img
						src={`https://toastmaster-user-photo.s3-ap-southeast-2.amazonaws.com/${currentUser.photo}`}
						alt="user avatar"
					/>
				) : (
					<img src={img} alt="user avatar" />
				)}
				(
				<div className="Dashboard__upload">
					<form onSubmit={handleSubmit}>
						<label htmlFor="image">Upload image photo</label>
						<input
							type="file"
							accept="image/*"
							name="image"
							onChange={handleFileChange}
						/>
						<label htmlFor="firstName">First Name</label>
						<input
							type="text"
							name="firstName"
							value={formData.firstName}
							onChange={handleChange}
						/>
						<label htmlFor="lastName">Last Name</label>
						<input
							type="text"
							name="lastName"
							value={formData.lastName}
							onChange={handleChange}
						/>
						<label htmlFor="email">Email</label>
						<input
							type="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
						/>
						<button>Update Profile</button>
					</form>
				</div>
				)
			</div>
		</div>
	);
};
Dashboard.propTypes = {
	auth: PropTypes.object.isRequired,
	updateMe: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth
});
export default connect(
	mapStateToProps,
	{ updateMe }
)(Dashboard);
