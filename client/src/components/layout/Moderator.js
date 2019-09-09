import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { toggleView } from '../../actions/users';

const Moderator = ({ auth: { currentUser }, toggleView }) => {
	const [isModerator, toggleModerator] = useState(false);

	// This sets is Moderator to false automatically after logging out
	useEffect(() => {
		toggleModerator(false);
	}, [currentUser]);

	const handleChange = () => {
		toggleModerator(!isModerator);
		toggleView();
	};
	return (
		currentUser &&
		currentUser.role !== 'user' && (
			<div className={`Moderator ${isModerator && 'Moderator__checked'}`}>
				<span className="Moderator__mode">
					View as:&nbsp;
					{isModerator
						? currentUser.role === 'admin' // Works with only two roles
							? 'admin'
							: 'committee'
						: 'user'}
				</span>
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
	auth: PropTypes.object.isRequired,
	toggleView: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth
});

export default connect(
	mapStateToProps,
	{ toggleView }
)(Moderator);
