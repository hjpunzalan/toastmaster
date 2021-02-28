import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { changePassword } from "../../actions/auth";
import useForms from "../../hooks/useForms";
import Spinner from "../utils/Spinner";
import { setAlert, resetAlert } from "../../actions/alerts";

export let inputs;

const ChangePassword = ({
	setAlert,
	resetAlert,
	changePassword,
	history,
	auth: { loading },
}) => {
	const blankForm = {
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	};
	const { formData, handleChange, handleSubmit } = useForms(
		blankForm,
		changePassword,
		{ history }
	);
	const { currentPassword, newPassword, confirmPassword } = formData;

	const passwordNotMatch = (e) => {
		resetAlert();
		e.preventDefault();
		setAlert("Passwords does not match", "fail");
	};

	inputs = [
		{
			label: "Current Password",
			placeholder: "Enter your current Password",
			value: currentPassword,
		},
		{
			label: "New Password",
			placeholder: "Enter your new Password",
			value: newPassword,
		},
		{
			label: "Confirm Password",
			placeholder: "Confirm password",
			value: confirmPassword,
		},
	];
	return loading ? (
		<Spinner />
	) : (
		<div className="Form">
			<button
				className="Form__goBack"
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
					newPassword !== confirmPassword ? passwordNotMatch : handleSubmit
				}>
				{inputs.map((input, i) => {
					return (
						<label key={input.label}>
							<b>{input.label}</b>

							<input
								type="password"
								placeholder={input.placeholder}
								value={input.value}
								name={Object.keys(blankForm)[i]}
								onChange={handleChange}
								autoComplete="on"
								minLength="6"
								required
							/>
						</label>
					);
				})}

				<div className="Form__btns">
					<input
						type="submit"
						className="btn btn__submit"
						value="Change Password"
					/>
				</div>
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
