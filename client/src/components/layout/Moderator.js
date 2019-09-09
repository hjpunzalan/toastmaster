import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const Moderator = ({ auth: { currentUser } }) => {
	const [isModerator, toggleModerator] = useState(false);

	const handleChange = () => {
		toggleModerator(!isModerator);
	};
	return (
		currentUser &&
		currentUser.role !== 'user' && (
			<div className={`Moderator ${isModerator && 'Moderator__checked'}`}>
				<span className="Moderator__mode">User view</span>
				<input
					className="Moderator__checkbox"
					id="moderator"
					type="checkbox"
					value={isModerator}
					onChange={handleChange}
				/>
				<label htmlFor="moderator" className="Moderator__slider" />
			</div>
		)
	);
};

Moderator.propTypes = {
	auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth
});

export default connect(mapStateToProps)(Moderator);
