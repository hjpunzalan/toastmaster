import PropTypes from "prop-types";
import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { logoutUser } from "../../actions/auth";
import logo from "../../img/logo.png";

export const Navbar = ({ auth: { isAuthenticated }, logoutUser }) => {
	const [nav, setNav] = useState(false);
	const toggleNav = () => setNav(!nav);

	return (
		<>
			<ul className={`Navbar ${!isAuthenticated ? "Navbar-withLogin" : ""}`}>
				<Link to="/" style={{ textDecoration: "none", width:"100%" }}>
					<div className="Navbar__left">
						<li className="Navbar__item">
							<img className="Navbar__logo" src={logo} alt="logo" />
						</li>
						<div className="Navbar__header">
							<li className="Navbar__item Navbar__header-text">
								Southern River Toastmasters
							</li>
							<li className="Navbar__item Navbar__header-caption">
								A President Distinguished Club
							</li>
						</div>
						<input
							type="checkbox"
							name="checkbox"
							id="hamburger"
							checked={nav}
							onChange={toggleNav}
						/>
						{isAuthenticated && (
							<label htmlFor="hamburger" className="Navbar__button">
								<span></span>
							</label>
						)}
					</div>
				</Link>
				<div className="Navbar__right">
					{isAuthenticated ? (
						<ul id="nav" className={nav ? "Navbar__open" : "Navbar__closed"}>
							<li className="Navbar__item">
								<Link
									className="Navbar__link"
									onClick={toggleNav}
									to="/dashboard">
									Dashboard
								</Link>
							</li>
							<li className="Navbar__item">
								<Link
									className="Navbar__link"
									onClick={toggleNav}
									to="/discussion">
									Discussion
								</Link>
							</li>
							<li className="Navbar__item">
								<Link
									className="Navbar__link"
									onClick={toggleNav}
									to="/members">
									Members
								</Link>
							</li>
							<li className="Navbar__item">
								<Link
									className="Navbar__link"
									to="/login"
									onClick={() => {
										toggleNav();
										logoutUser();
									}}>
									Logout
								</Link>
							</li>
						</ul>
					) : (
						<li className="Navbar__item">
							<Link className="Navbar__link" to="/login">
								Login
							</Link>
						</li>
					)}
				</div>
			</ul>
		</>
	);
};

Navbar.propTypes = {
	auth: PropTypes.object.isRequired,
	logoutUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
});

export default connect(mapStateToProps, { logoutUser })(Navbar);
