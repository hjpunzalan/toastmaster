import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { changePassword } from "../../actions/auth";
import useForms from "../../hooks/useForms";
import Spinner from "../utils/Spinner";
import { setAlert, resetAlert } from "../../actions/alerts";

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

	return loading ? (
		<Spinner />
	) : (
		<div data-test="component-changepassword" className="Form">
			<Link className="Form__goBack" to="/dashboard">
				<button>Cancel</button>
			</Link>
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
				<label htmlFor="currentPassword">
					<b>Current Password</b>
				</label>
				<input
					type="password"
					placeholder="Enter your current Password"
					name="currentPassword"
					value={currentPassword}
					onChange={handleChange}
					required
					autoComplete="on"
				/>
				<br />
				<br />
				<label htmlFor="newPassword">
					<b>New Password</b>
				</label>
				<input
					type="password"
					placeholder="Enter your new Password"
					name="newPassword"
					value={newPassword}
					onChange={handleChange}
					autoComplete="on"
					minLength="6"
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
