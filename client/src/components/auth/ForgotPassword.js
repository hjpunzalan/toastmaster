import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { forgotPassword } from '../../actions/auth';
import Spinner from '../utils/Spinner';

const ForgotPassword = ({ forgotPassword, auth: { loading } }) => {
	const [email, setEmail] = useState('');

	const handleSubmit = e => {
		e.preventDefault();
		forgotPassword(email, document.location.href);
	};

	return loading ? (
		<Spinner />
	) : (
		<div className="Form">
			<h1>Forgot your password?</h1>
			<p className="Form__text">
				Please enter the email address registered to your account and we will
				send you the link to reset your password.
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
					onChange={e => setEmail(e.target.value)}
					required
				/>
				<input type="submit" className="btn btn__submit" value="Send Email" />
			</form>
		</div>
	);
};

ForgotPassword.propTypes = {
	forgotPassword: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth
});

export default connect(
	mapStateToProps,
	{ forgotPassword }
)(ForgotPassword);
