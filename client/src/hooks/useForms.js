import { useState } from "react";

const useForms = (blankForm, action, ...args) => {
	const [formData, setFormData] = useState({ ...blankForm });

	return {
		formData,
		handleChange: (e) => {
			setFormData({ ...formData, [e.target.name]: e.target.value });
		},
		handleSubmit: (e) => {
			e.preventDefault();
			action(formData, ...args);
			setFormData({ ...blankForm });
		},
		handleCancel: () => {
			setFormData({ ...blankForm });
		},
	};
};

export default useForms;
