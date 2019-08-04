import React from 'react';

const Register = () => {
	return (
		<div className="register">
			<h1>Register a User</h1>
			<p className="register__text">
				Please fill the form as per member's details
			</p>
			<hr />
			<form className="register__form" action="#">
				<label htmlFor="first-name">
					<b>First Name</b>
				</label>
				<input
					type="text"
					placeholder="Enter first name"
					name="first-name"
					required
				/>
				<label htmlFor="last-name">
					<b>Last Name</b>
				</label>
				<input
					type="text"
					placeholder="Enter last name"
					name="last-name"
					required
				/>
				<label htmlFor="email">
					<b>Email</b>
				</label>
				<input type="text" placeholder="Enter Email" name="email" required />
				<div className="register__btns">
					<button className="btn btn__cancel">Cancel</button>
					<input type="submit" className="btn btn__register" value="Register" />
				</div>
			</form>
		</div>
	);
};

export default Register;
