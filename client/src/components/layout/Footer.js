import React from 'react';
import tagline from '../../img/tagline.svg';
import ReactSVG from 'react-svg';

const Footer = () => {
	return (
		<div className="Footer">
			<div className="Footer__left">
				<ReactSVG
					src={tagline}
					beforeInjection={svg => {
						svg.classList.add('Footer__tagline');
					}}
				/>
			</div>
		</div>
	);
};

export default Footer;
