import React, { useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { toggleView } from "../../actions/users";

export const Moderator = ({
	auth: { currentUser },
	toggleView,
	users: { Moderator },
}) => {

	useEffect(() => {
		if (Moderator) toggleView();
		// eslint-disable-next-line
	}, [currentUser]);

	return (
		currentUser &&
		currentUser.role !== "user" && (
			<div className={`Moderator${Moderator ? " Moderator__checked" : ""}`}>
				<span className="Moderator__mode">
					View as:&nbsp;
					{Moderator
						? currentUser.role === "admin" // Works with only two roles
							? "admin"
							: "committee"
						: "user"}
				</span>
				<input
					className="Moderator__checkbox"
					id="moderator"
					type="checkbox"
					value={Moderator}
					onChange={toggleView}
				/>
				<label htmlFor="moderator" className="Moderator__slider" />
			</div>
		)
	);
};

Moderator.propTypes = {
	auth: PropTypes.object.isRequired,
	toggleView: PropTypes.func.isRequired,
	users: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => (alerts:
	{
	auth: state.auth,
	users: state.users,
});

export default connect(mapStateToProps, { toggleView })(Moderator);
