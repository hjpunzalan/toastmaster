import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const Alert = ({ msg, alertType }) => {
	return (
		alertType !== null && (
			<div className={`Alert Alert__${alertType}`}>
				<strong>{alertType === 'fail' ? 'Warning: ' : 'Success: '}</strong>
				{msg.map(alert => (
					<p key={msg}>
						<br /> {alert}
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
