import React, { Fragment } from 'react';
import logo from '../../img/logo.jpg';

const Navbar = () => {
	return (
		<Fragment>
			<ul className="navbar">
				<div className="navbar__left">
					<li className="navbar__item">
						<img className="navbar__logo" src={logo} alt="logo" />
					</li>
					<div className="navbar__header-container">
						<li className="navbar__item navbar__header">
							Southern River Toastmasters
						</li>
						<li className="navbar__item navbar__header-caption">
							A President's Distinguished Club
						</li>
					</div>
				</div>
				<div className="navbar__right">
					<li className="navbar__item">News</li>
					<li className="navbar__item">Login</li>
				</div>
			</ul>
		</Fragment>
	);
};

export default Navbar;
