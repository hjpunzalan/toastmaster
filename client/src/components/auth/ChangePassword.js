import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { changePassword } from "../../actions/auth";
import useForms from "../../hooks/useForms";
import Spinner from "../utils/Spinner";
import { setAlert, resetAlert } from "../../actions/alerts";

export let inputs;

export const ChangePassword = ({
	setAlert,
	resetAlert,
	changePassword,
	history,
	auth: { loading },
	initialFormState,
}) => {
	const blankForm = {
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	};

	const { formData, handleChange, handleSubmit } = useForms(
		initialFormState ? initialFormState : blankForm,
		changePassword,
		{ history }
	);
	const passwordNotMatch = (e) => {
		resetAlert();
		e.preventDefault();
		setAlert("Passwords does not match", "fail");
	};
	// This ensures all names and values correctly follows formData state
	const names = Object.keys(initialFormState ? initialFormState : blankForm);

	// Form data should contain all formData names
	inputs = [
		{
			label: "Current Password",
			placeholder: "Enter your current Password",
			name: names[0],
			value: formData[names[0]],
		},
		{
			label: "New Password",
			placeholder: "Enter your new Password",
			name: names[1],
			value: formData[names[1]],
		},
		{
			label: "Confirm Password",
			placeholder: "Confirm password",
			name: names[2],
			value: formData[names[2]],
		},
	];
	return loading ? (
		<Spinner />
	) : (
		<div className="Form">
			<button
				className="Form__goBack btn__cancel"
				onClick={() => {
					history.push("/dashboard");
				}}>
				Cancel
			</button>
			<h1>Change Your Password</h1>
			<p className="Form__text">
				Changing your password will log you out from other devices.
			</p>
			<hr />
			<form
				className="Form__form"
				onSubmit={
					formData[names[1]] !== formData[names[2]]
						? passwordNotMatch
						: handleSubmit
				}
				>
				{inputs.map((input) => {
					return (
						<label key={input.label}>
							<b>{input.label}</b>

							<input
								type="password"
								placeholder={input.placeholder}
								value={input.value}
								name={input.name}
								onChange={handleChange}
								autoComplete="on"
								minLength="6"
								required
							/>
						</label>
					);
				})}
<input type="submit" className="btn btn__submit" value="Submit" />
			</form>
		</div>
	);
};

ChangePassword.propTypes = {
	changePassword: PropTypes.func.isRequired,
	setAlert: PropTypes.func.isRequired,
	resetAlert: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
});

export default connect(mapStateToProps, {
	changePassword,
	setAlert,
	resetAlert,
})(ChangePassword);
