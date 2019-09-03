import React from 'react';

const Update = ({ handleSubmit, handleFileChange, formData, handleChange }) => {
	return (
		<div className="Form">
			<h1>Update your profile</h1>
			<form className="Form__form" onSubmit={handleSubmit}>
				<label className="Form__text" htmlFor="image">
					Profile photo
				</label>
				<input
					type="file"
					accept="image/*"
					name="image"
					onChange={handleFileChange}
				/>
				<label className="Form__text" htmlFor="firstName">
					First Name
				</label>
				<input
					type="text"
					name="firstName"
					value={formData.firstName}
					onChange={handleChange}
				/>
				<label className="Form__text" htmlFor="lastName">
					Last Name
				</label>
				<input
					type="text"
					name="lastName"
					value={formData.lastName}
					onChange={handleChange}
				/>
				<label className="Form__text" htmlFor="email">
					Email
				</label>
				<input
					type="email"
					name="email"
					value={formData.email}
					onChange={handleChange}
				/>
				<button className="btn btn__submit">Submit</button>
			</form>
		</div>
	);
};

export default Update;
