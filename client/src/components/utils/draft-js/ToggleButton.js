import React from 'react';

const ToggleButton = ({ Component }) => {
	const [active, setActive] = React.useState(false);

	const handleClick = () => {
		if (!active) setActive(true);
		else setActive(false);
	};
	return (
		<Component
			className={
				active
					? 'RichEditor-styleButton'
					: 'RichEditor-styleButton RichEditor-activeButton'
			}
			style={{ fontSize: '2rem' }}
			onClick={handleClick}
		/>
	);
};

export default ToggleButton;
