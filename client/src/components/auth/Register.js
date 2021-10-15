import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";
import { registerUser } from "../../actions/users";
import useForms from "../../hooks/useForms";
import Spinner from "../utils/Spinner";

export let inputs;

export const Register = ({
	registerUser,
	users: { loading, Moderator },
	auth: { currentUser },
	history,
	initialFormState,
}) => {
	const blankForm = { firstName: "", lastName: "", email: "" };

	// replace register with login to send url by email to user
	const url = document.location.href.replace("register", "login");

	const { formData, handleChange, handleSubmit, handleCancel } = useForms(
		initialFormState ? initialFormState : blankForm,
		registerUser,
		{
			url,
		}
	);

	// This ensures all names and values correctly follows formData state
	const names = Object.keys(initialFormState ? initialFormState : blankForm);

	// Form data should contain all formData names
	inputs = [
		{
			label: "First Name",
			placeholder: "Enter first name",
			name: names[0],
			value: formData[names[0]],
		},
		{
			label: "Last Name",
			placeholder: "Enter last name",
			name: names[1],
			value: formData[names[1]],
		},
		{
			label: "Email",
			placeholder: "Enter Email",
			name: names[2],
			value: formData[names[2]],
		},
	];

	return currentUser.role === "user" || !Moderator ? (
		<Redirect to="/dashboard" />
	) : loading ? (
		<Spinner />
	) : (
		<div className="Form">
			<button
				className="Form__goBack btn__cancel"
				onClick={() => {
					history.push("/members");
				}}>
				Cancel
			</button>
			<h1>Register a User</h1>
			<p className="Form__text">Please fill the form as per member's details</p>
			<hr />
			<form className="Form__form" onSubmit={handleSubmit}>
		<label key={inputs[0].label}>
								<b>{inputs[0].label}</b>

								<input
									type="text"
									placeholder={inputs[0].placeholder}
									value={inputs[0].value}
									name={inputs[0].name}
								onChange={handleChange}
								maxLength={15}
									autoComplete="on"
									required
								/>
						</label>
						<label key={inputs[1].label}>
								<b>{inputs[1].label}</b>

								<input
									type="text"
									placeholder={inputs[1].placeholder}
									value={inputs[1].value}
									name={inputs[1].name}
									onChange={handleChange}
								autoComplete="on"
								maxLength={15}
									required
								/>
							</label>
				<label key={inputs[2].label}>
					<b>{inputs[2].label}</b>

					<input
						type="email"
						placeholder={inputs[2].placeholder}
						value={inputs[2].value}
						name={inputs[2].name}
						onChange={handleChange}
						autoComplete="on"
						required
					/>
						</label>
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
