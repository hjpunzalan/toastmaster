import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import useForms from '../../hooks/useForms';
import { loginUser } from '../../actions/auth';
import Spinner from '../utils/Spinner';

const ResetPassword = ({
	loginUser,
	history,
	auth: { isAuthenticated, loading }
}) => {
	const blankForm = {
		email: '',
		password: ''
	};
	const { formData, handleChange, handleSubmit } = useForms(
		blankForm,
		loginUser,
		history
	);
	const { email, password } = formData;

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
				<label htmlFor="password">
					<b>Password</b>
				</label>
				<input
					type="password"
					placeholder="Enter Password"
					name="password"
					value={password}
					onChange={handleChange}
					required
					autoComplete="on"
				/>
				<div className="Form__btns">
					<input type="submit" className="btn btn__submit" value="Login" />
				</div>
				<Link className="Form__link" to="/forgotpassword">
					Forgot your password?
				</Link>
			</form>
		</div>
	);
};

ResetPassword.propTypes = {
	loginUser: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth
});

export default connect(
	mapStateToProps,
	{ loginUser }
)(ResetPassword);
