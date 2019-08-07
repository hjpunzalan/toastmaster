import React from 'react';
import tagline from '../../img/tagline.png';

const Footer = () => {
	return (
		<div className="Footer">
			<div className="Footer__left">LEFT</div>
			<div className="Footer__middle">
				<img src={tagline} className="Footer__tagline" alt="tagline" />
			</div>
			<div className="Footer__right">RIGHT</div>
		</div>
	);
};

export default Footer;
