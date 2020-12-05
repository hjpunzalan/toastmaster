import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { resetPassword } from "../../actions/auth";
import useForms from "../../hooks/useForms";
import Spinner from "../utils/Spinner";
import { setAlert, resetAlert } from "../../actions/alerts";

const ResetPassword = ({
	setAlert,
	resetAlert,
	resetPassword,
	match: {
		params: { resetToken },
	},
	history,
	auth: { loading },
}) => {
	const blankForm = {
		password: "",
		confirmPassword: "",
	};
	const { formData, handleChange, handleSubmit } = useForms(
		blankForm,
		resetPassword,
		{ resetToken, history }
	);
	const { password, confirmPassword } = formData;

	const passwordNotMatch = (e) => {
		resetAlert();
		e.preventDefault();
		setAlert("Passwords does not match", "fail");
	};

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
					password !== confirmPassword ? passwordNotMatch : handleSubmit
				}>
				<label htmlFor="password">
					<b>Password</b>
				</label>
				<input
					type="password"
					placeholder="Enter a new Password"
					name="password"
					value={password}
					onChange={handleChange}
					minLength="6"
					autoComplete="on"
					required
				/>
				<label htmlFor="confirmPassword">
					<b>Confirm Password</b>
				</label>
				<input
					type="password"
					placeholder="Confirm password"
					name="confirmPassword"
					value={confirmPassword}
					onChange={handleChange}
					minLength="6"
					required
				/>
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
