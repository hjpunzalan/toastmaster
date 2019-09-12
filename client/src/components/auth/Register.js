import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { registerUser } from '../../actions/users';
import useForms from '../../hooks/useForms';

const Register = ({ registerUser }) => {
	// This makes react the single source of truth
	const blankForm = { firstName: '', lastName: '', email: '' };
	const { formData, handleChange, handleSubmit, handleCancel } = useForms(
		blankForm,
		registerUser
	);
	const { firstName, lastName, email } = formData;

	return (
		<div className="Form">
			<Link to="/members" className="Form__goBack">
				<button>Go Back</button>
			</Link>
			<h1>Register a User</h1>
			<p className="Form__text">Please fill the form as per member's details</p>
			<hr />
			<form className="Form__form" onSubmit={handleSubmit}>
				<label htmlFor="firstName">
					<b>First Name</b>
				</label>
				<input
					type="text"
					placeholder="Enter first name"
					name="firstName"
					value={firstName}
					onChange={handleChange}
					required
				/>
				<label htmlFor="lastName">
					<b>Last Name</b>
				</label>
				<input
					type="text"
					placeholder="Enter last name"
					name="lastName"
					value={lastName}
					onChange={handleChange}
					required
				/>
				<label htmlFor="email">
					<b>Email</b>
				</label>
				<input
					type="text"
					placeholder="Enter Email"
					name="email"
					value={email}
					onChange={handleChange}
					required
				/>
				<div className="Form__btns">
					<button className="btn" onClick={handleCancel}>
						Clear
					</button>
					<input type="submit" className="btn btn__submit" value="Register" />
				</div>
			</form>
		</div>
	);
};

Register.propTypes = {
	registerUser: PropTypes.func.isRequired
};

export default connect(
	null,
	{ registerUser }
)(Register);
