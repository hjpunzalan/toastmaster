import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const Alert = ({ msg, alertType }) => {
	return (
		alertType !== null && (
			<div className={`Alert Alert__${alertType}`}>
				{msg.map(alert => (
					<p key={msg} className={`Alert__msg`}>
						{alert}
					</p>
				))}
			</div>
		)
	);
};

Alert.propTypes = {
	msg: PropTypes.array.isRequired,
	alertType: PropTypes.string
};

const mapStateToProps = state => ({
	msg: state.alerts.msg,
	alertType: state.alerts.alertType
});

export default connect(mapStateToProps)(Alert);
