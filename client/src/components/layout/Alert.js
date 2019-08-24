import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const Alert = ({ msg, alertType }) => {
	return (
		alertType !== null && (
			<div className={`Alert Alert__${alertType}`}>
				<p key={msg} className={`Alert__msg`}>
					<strong>{alertType === 'fail' ? 'Warning: ' : 'Success: '}</strong>
					{msg.map(alert => (
						<span key={msg}>
							<br /> {alert}
						</span>
					))}
				</p>
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
