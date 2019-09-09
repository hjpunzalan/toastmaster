import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import useForms from '../../../hooks/useForms';
import { updateMe } from '../../../actions/users';

const Update = ({ auth: { currentUser }, updateMe, history }) => {
	const [file, setFile] = useState('');
	const { firstName, lastName, email } = currentUser;
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
		<div className="Form">
			<Link to="/dashboard">
				<button className="btn btn__cancel-sm">Cancel</button>
			</Link>
			<h1 className="Form__title">Update your profile</h1>
			<form className="Form__form" onSubmit={handleSubmit}>
				<label htmlFor="image">
					<strong>Profile photo</strong>
				</label>
				<input
					type="file"
					accept="image/*"
					name="image"
					onChange={handleFileChange}
				/>
				<label htmlFor="firstName">
					<strong>First Name</strong>
				</label>
				<input
					type="text"
					name="firstName"
					value={formData.firstName}
					onChange={handleChange}
				/>
				<label htmlFor="lastName">
					<strong>Last Name</strong>
				</label>
				<input
					type="text"
					name="lastName"
					value={formData.lastName}
					onChange={handleChange}
				/>
				<label htmlFor="email">
					<strong>Email</strong>
				</label>
				<input
					type="email"
					name="email"
					value={formData.email}
					onChange={handleChange}
				/>
				<button className="btn btn__submit">Submit</button>
			</form>
		</div>
	);
};

Update.propTypes = {
	updateMe: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth
});

export default connect(
	mapStateToProps,
	{ updateMe }
)(Update);
