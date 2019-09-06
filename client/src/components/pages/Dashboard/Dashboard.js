import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import img from '../../../img/anonymous.png';
import useForms from '../../../hooks/useForms';
import { updateMe, toggleUpdateMe } from '../../../actions/users';
import Update from './Update';

const Dashboard = ({
	auth: { currentUser, isModified, edit },
	updateMe,
	history,
	toggleUpdateMe
}) => {
	useEffect(() => {
		if (edit) toggleUpdateMe(edit); //eslint-disable-next-line
	}, []);

	const { firstName, lastName, email } = currentUser;
	const [file, setFile] = useState('');
	const blankForm = { firstName, lastName, email };
	const { formData, handleChange, handleSubmit } = useForms(
		blankForm,
		updateMe,
		file,
		history
	);

	const newImageSrc = `${currentUser.photo}?` + Date.now();

	const handleFileChange = e => {
		setFile(e.target.files[0]);
	};
	return (
		<div className="Dashboard">
			<div className="Dashboard__left">
				{!edit ? (
					<>
						<h1 className="Dashboard__title">Member's Dashboard</h1>
						<p className="Dashboard__label">
							Here you will find club guidelines and resources available to its
							members.
						</p>
						<hr />
					</>
				) : (
					<>
						<button
							className="btn Dashboard__cancel"
							onClick={() => toggleUpdateMe(edit)}>
							Go Back
						</button>
						<Update
							handleSubmit={handleSubmit}
							handleFileChange={handleFileChange}
							formData={formData}
							handleChange={handleChange}
						/>
					</>
				)}
			</div>
			{!edit && (
				<div className="Dashboard__right">
					{currentUser.photo ? (
						<img
							className="Dashboard__user-photo"
							src={isModified ? newImageSrc : currentUser.photo}
							alt="user avatar"
						/>
					) : (
						<img
							className="Dashboard__user-photo"
							src={img}
							alt="user avatar"
						/>
					)}
					<p className="Dashboard__user">Hi {currentUser.firstName}!</p>

					<button
						className="btn btn__submit"
						onClick={() => toggleUpdateMe(edit)}>
						Update Profile
					</button>
				</div>
			)}
		</div>
	);
};
Dashboard.propTypes = {
	auth: PropTypes.object.isRequired,
	updateMe: PropTypes.func.isRequired,
	toggleUpdateMe: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth
});
export default connect(
	mapStateToProps,
	{ updateMe, toggleUpdateMe }
)(Dashboard);
