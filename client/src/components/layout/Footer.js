import React from 'react';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import tagline from '../../img/tagline.png';

const Footer = () => {
	return (
		<div className="Footer">
			<div className="Footer__left">
				<p className="Footer__text">
					Every Wednesday 6:30pm at Bletchely Park Primary School
				</p>
			</div>
			<div className="Footer__middle">
				<a href="https://www.toastmasters.org/">
					<img src={tagline} className="Footer__tagline" alt="tagline" />
				</a>
			</div>
			<p className="Footer__credit">Website by Jonathan Punzalan</p>
			<div className="Footer__right">
				<a
					className="Footer__link"
					href="https://www.facebook.com/SRTOASTMASTERSCLUB/">
					<FaFacebook className="Footer__logo Footer__logo-facebook" />
				</a>
				<a
					className="Footer__link"
					href="https://www.instagram.com/sr_toastmasters/">
					<FaInstagram className="Footer__logo Footer__logo-instagram" />
				</a>
			</div>
		</div>
	);
};

export default Footer;
