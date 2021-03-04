import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { resetPassword } from "../../actions/auth";
import useForms from "../../hooks/useForms";
import Spinner from "../utils/Spinner";
import { setAlert, resetAlert } from "../../actions/alerts";

export let inputs;

export const ResetPassword = ({
	setAlert,
	resetAlert,
	resetPassword,
	match: {
		params: { resetToken },
	},
	history,
	auth: { loading },
	initialFormState,
}) => {
	const blankForm = {
		password: "",
		confirmPassword: "",
	};
	const { formData, handleChange, handleSubmit } = useForms(
		initialFormState ? initialFormState : blankForm,
		resetPassword,
		{ resetToken, history }
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
			label: "Password",
			placeholder: "Enter a new Password",
			name: names[0],
			value: formData[names[0]],
		},
		{
			label: "Confirm password",
			placeholder: "Confirm password",
			name: names[1],
			value: formData[names[1]],
		},
	];

	return loading ? (
		<Spinner />
	) : (
		<div className="Form">
			<h1>Reset your password</h1>
			<p className="Form__text">Please enter a new password below.</p>
			<hr />
			<form
				className="Form__form"
				onSubmit={
					formData[names[1]] !== formData[names[2]]
						? passwordNotMatch
						: handleSubmit
				}>
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
				<div className="Form__btns">
					<input type="submit" className="btn btn__submit" value="Login" />
				</div>
			</form>
		</div>
	);
};

ResetPassword.propTypes = {
	resetPassword: PropTypes.func.isRequired,
	setAlert: PropTypes.func.isRequired,
	resetAlert: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
});

export default connect(mapStateToProps, {
	resetPassword,
	setAlert,
	resetAlert,
})(ResetPassword);
