import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";
import { registerUser } from "../../actions/users";
import useForms from "../../hooks/useForms";
import Spinner from "../utils/Spinner";

const Register = ({
	registerUser,
	users: { loading, Moderator },
	auth: { currentUser },
	history,
}) => {
	// This makes react the single source of truth
	const handleRegister = (formData) => {
		// replace register with login
		const url = document.location.href.replace("register", "login");
		console.log(url);
		registerUser(formData, url);
	};

	const blankForm = { firstName: "", lastName: "", email: "" };
	const { formData, handleChange, handleSubmit, handleCancel } = useForms(
		blankForm,
		handleRegister
	);
	const { firstName, lastName, email } = formData;

	return currentUser.role === "user" || !Moderator ? (
		<Redirect to="/dashboard" />
	) : loading ? (
		<Spinner />
	) : (
		<div className="Form">
			<button
				data-test="cancel-button"
				className="Form__goBack"
				onClick={() => {
					history.push("/members");
				}}>
				Cancel
			</button>
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
					type="email"
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
	registerUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	users: state.users,
	auth: state.auth,
});

export default connect(mapStateToProps, { registerUser })(Register);
