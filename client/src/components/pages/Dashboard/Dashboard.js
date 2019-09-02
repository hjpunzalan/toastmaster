import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import img from '../../../img/anonymous.png';

const Dashboard = ({ auth: { currentUser } }) => {
	const [file, setFile] = useState(null);

	const handleFileChange = e => {
		setFile(e.target.files[0]);
		console.log(e.target.files);
	};
	return (
		<div className="Dashboard">
			<div className="Dashboard__left">
				<h1 className="Dashboard__title">Member's Dashboard</h1>
				<p className="Dashboard__label">
					Here you will find club guidelines and resources available to its
					members.
				</p>
				<hr />
			</div>
			<div className="Dashboard__right">
				{currentUser && currentUser.img ? (
					<img src={currentUser.img} alt="user avatar" />
				) : (
					<img src={img} alt="user avatar" />
				)}
				<div className="Dashboard__upload">
					<h5>Add an Image</h5>
					<input type="file" accept="image/*" onChange={handleFileChange} />
				</div>
			</div>
		</div>
	);
};
Dashboard.propTypes = {
	auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth
});
export default connect(mapStateToProps)(Dashboard);
