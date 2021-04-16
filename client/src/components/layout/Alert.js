import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

export const Alert = ({ msg, alertType, error }) => {
	return (
		alertType !== null && (
			<div className={`Alert Alert__${alertType}`}>
				<strong>{alertType === "fail" ? "Warning: " : "Success: "}</strong>
				{Object.keys(error).length === 0 ? msg.map((alert) => (
					<p key={alert}>{alert} </p>
				)) : <p key={error.status}>{error.msg}</p>}
			</div>
		)
	);
};

Alert.propTypes = {
	msg: PropTypes.array.isRequired,
	alertType: PropTypes.string,
};

const mapStateToProps = (state) => ({
	msg: state.alerts.msg,
	alertType: state.alerts.alertType,
	error: state.alerts.error
});

export default connect(mapStateToProps)(Alert);
