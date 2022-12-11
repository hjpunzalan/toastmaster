import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { loginUser } from "../../actions/auth";
import useForms from "../../hooks/useForms";
import Spinner from "../utils/Spinner";

export let inputs;

export const Login = ({
	loginUser,
	history,
	auth: { isAuthenticated, loading },
	initialFormState,
}) => {
	const blankForm = {
		email: "",
		password: "",
	};
	const { formData, handleChange, handleSubmit } = useForms(
		initialFormState ? initialFormState : blankForm,
		loginUser,
		{ history }
	);

	// This ensures all names and values correctly follows formData state
	const names = Object.keys(initialFormState ? initialFormState : blankForm);

	// Form data should contain all formData names
	inputs = [
		{
			label: "Email",
			placeholder: "Enter email",
			name: names[0],
			value: formData[names[0]],
		},
		{
			label: "Password",
			placeholder: "Enter Password",
			name: names[1],
			value: formData[names[1]],
		},
	];

	// Redirect if logged in
	if (isAuthenticated) {
		return <Redirect to="/dashboard" />;
	}

	return loading ? (
		<Spinner />
	) : (
		<div className="Form">
			<h1>Login</h1>
			<p className="Form__text">
				Please login with your email address and password
			</p>
			<hr />
			<form className="Form__form" onSubmit={handleSubmit}>
				<label>
					<b>{inputs[0].label}</b>
					<input
						type="text"
						placeholder={inputs[0].placeholder}
						name={inputs[0].name}
						value={inputs[0].value}
						onChange={handleChange}
						required
					/>
				</label>
				<label>
					<b>{inputs[1].label}</b>
					<input
						type="password"
						placeholder={inputs[1].placeholder}
						name={inputs[1].name}
						value={inputs[1].value}
						onChange={handleChange}
						required
						autoComplete="on"
					/>
				</label>
				<div style={{ display: "flex", gap: "2rem", marginBottom: "4rem" }}>
					<button
						onClick={async (e) => {
							e.preventDefault();

							await loginUser({
								formData: {
									email: "test@example.com",
									password: "test123",
								},
								history,
							});
						}}
						className="btn btn__submit-trial">
						TEST USER
					</button>
					<input type="submit" className="btn btn__submit" value="Login" />
				</div>

				<Link className="Form__link" to="/forgotpassword">
					Forgot your password?
				</Link>
			</form>
		</div>
	);
};

Login.propTypes = {
	loginUser: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
});

export default connect(mapStateToProps, { loginUser })(Login);
