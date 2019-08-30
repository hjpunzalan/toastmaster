import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import useForms from '../../hooks/useForms';
import { loginUser } from '../../actions/auth';

const Login = ({ loginUser, history }) => {
	const blankForm = { email: '', password: '' };
	const { formData, handleChange, handleSubmit } = useForms(
		blankForm,
		loginUser,
		history
	);
	const { email, password } = formData;
	return (
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

Login.propTypes = {
	loginUser: PropTypes.func.isRequired
};

export default connect(
	null,
	{ loginUser }
)(Login);
