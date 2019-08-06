import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { resetAlert } from '../../actions/alerts';
import PropTypes from 'prop-types';

const Alert = ({ msg, alertType, resetAlert }) => {
	return (
		alertType !== null && (
			<div className={`Alert Alert__${alertType}`}>
				{msg.map(alert => (
					<p className={`Alert__msg Alert__msg-${alertType}`}>{alert}</p>
				))}
			</div>
		)
	);
};

Alert.propTypes = {
	msg: PropTypes.array.isRequired,
	alertType: PropTypes.string.isRequired,
	resetAlert: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	msg: state.alerts.msg,
	alertType: state.alerts.alertType
});

export default connect(
	mapStateToProps,
	{ resetAlert }
)(Alert);
