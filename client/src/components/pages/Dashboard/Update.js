import React, { useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import useForms from "../../../hooks/useForms";
import { updateMe } from "../../../actions/users";

export const Update = ({ auth: { currentUser }, updateMe, history }) => {
	const [file, setFile] = useState("");
	const { firstName, lastName, email } = currentUser;
	const blankForm = { firstName, lastName, email };
	const { formData, handleChange, handleSubmit } = useForms(
		blankForm,
		updateMe,
		{file,
		history}
	);

	const handleFileChange = (e) => {
		setFile(e.target.files[0]);
	};

	// 
	//
	// Refactor labelling

	return (
		<div className="Form">
			<button
				className="Form__goBack"
				onClick={() => {
					history.push("/dashboard");
				}}>
				Cancel
			</button>
			<h1>Update your profile</h1>
			<form className="Form__form" onSubmit={handleSubmit}>
				<label>
					<strong>Profile photo</strong>
				<input
					type="file"
					accept="image/*"
					name="image"
					onChange={handleFileChange}
					/>
					</label>
				<label>
					<strong>First Name</strong>
				<input
					type="text"
					name="firstName"
					value={formData.firstName}
					onChange={handleChange}
					/>
					</label>
				<label>
					<strong>Last Name</strong>
				<input
					type="text"
					name="lastName"
					value={formData.lastName}
					onChange={handleChange}
					/>
						</label>
				<label>
					<strong>Email</strong>
				<input
					type="email"
					name="email"
					value={formData.email}
					onChange={handleChange}
					/>
						</label>
				<button className="btn btn__submit">Submit</button>
			</form>
		</div>
	);
};

Update.propTypes = {
	updateMe: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
});

export default connect(mapStateToProps, { updateMe })(Update);
