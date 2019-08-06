import React, { Fragment } from 'react';
import logo from '../../img/logo.jpg';

const Navbar = () => {
	return (
		<Fragment>
			<ul className="Navbar">
				<div className="Navbar__left">
					<li className="Navbar__item">
						<img className="Navbar__logo" src={logo} alt="logo" />
					</li>
					<div className="Navbar__header-container">
						<li className="Navbar__item Navbar__header">
							Southern River Toastmasters
						</li>
						<li className="Navbar__item Navbar__header-caption">
							A President's Distinguished Club
						</li>
					</div>
				</div>
				<div className="Navbar__right">
					<li className="Navbar__item">News</li>
					<li className="Navbar__item">Login</li>
				</div>
			</ul>
		</Fragment>
	);
};

export default Navbar;
