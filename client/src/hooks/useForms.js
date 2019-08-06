import { useState } from 'react';

export default (blankForm, action, ...args) => {
	const [formData, setFormData] = useState({ ...blankForm });

	return {
		formData,
		handleChange: e => {
			setFormData({ ...formData, [e.target.name]: e.target.value });
		},
		handleSubmit: e => {
			e.preventDefault();
			action(formData, ...args);
		},
		handleCancel: () => {
			setFormData({ ...blankForm });
		}
	};
};
