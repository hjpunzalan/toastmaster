import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import 'moment-timezone';
import {
	toggleCreateAnnouncement,
	createAnnouncement
} from '../../../actions/announcements';
import CreatePost from '../../utils/CreatePost';
import ReadOnly from '../../utils/draft-js/ReadOnly';

const Announcements = ({
	users: { Moderator },
	toggleCreateAnnouncement,
	createAnnouncement,
	getAnnouncements,
	announcements: { edit, announcements },
	textEditor: { contentState }
}) => {
	const [title, setTitle] = useState('');

	// Announcement handlers
	const handleToggle = () => {
		toggleCreateAnnouncement();
		setTitle('');
	};

	const handleSubmit = () => {
		createAnnouncement(title, contentState);
		setTitle('');
	};

	// For facebook post
	let width = 750;
	let height = 588;
	if (window.screen.width < 1150) {
		width = 500;
		height = 441;
	}
	if (window.screen.width < 720) {
		width = 400;
		height = 398;
	}
	if (window.screen.width < 450) {
		width = 350;
		height = 366;
	}
	return edit ? (
		<div className="Dashboard__editor">
			<CreatePost
				handleToggle={handleToggle}
				title={title}
				setTitle={setTitle}
				handleSubmit={handleSubmit}
				type={'announcement'}
			/>
		</div>
	) : (
		<div className="Dashboard__left">
			<div className="Dashboard__top">
				<h1 className="Dashboard__title">Announcements</h1>
				{Moderator && (
					<button
						className="btn btn__submit"
						onClick={toggleCreateAnnouncement}>
						Post new announcement
					</button>
				)}
			</div>
			<div className="Dashboard__announcements">
				<div className="Dashboard__announcement">
					<h1 className="Dashboard__announcement-title"> Title</h1>
					<ReadOnly contentState={announcements[0].contentState} />
					<div className="Dashboard__announcement-bottom">
						<Moment tz="Australia/Perth" format="ddd MMM DD YYYY HH:mm">
							{announcements[0].date}
						</Moment>
						<span>Posted by: {announcements[0].user.firstName}</span>
					</div>
				</div>
				<iframe
					className="Dashboard__facebook"
					title="Southern River Toastmaster Facebook"
					src={`https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2FSRTOASTMASTERSCLUB%2Fposts%2F1714806421985710&width=500&show_text=true&appId=2411264755855685&height=${height}`}
					width={width}
					height={height}
					scrolling="no"
					frameBorder="0"
					allowtransparency="true"
					allow="encrypted-media"></iframe>
				{announcements.slice(1).map(el => (
					<div key={el._id} className="Dashboard__announcement">
						<h1 className="Dashboard__announcement-title"> {el.title}</h1>
						<ReadOnly contentState={el.contentState} />
						<div className="Dashboard__announcement-bottom">
							<Moment tz="Australia/Perth" format="ddd MMM DD YYYY HH:mm">
								{el.date}
							</Moment>
							<span>Posted by: {el.user.firstName}</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

Announcements.propTypes = {
	users: PropTypes.object.isRequired,
	toggleCreateAnnouncement: PropTypes.func.isRequired,
	createAnnouncement: PropTypes.func.isRequired,
	announcements: PropTypes.object.isRequired,
	textEditor: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	users: state.users,
	announcements: state.announcements,
	textEditor: state.textEditor
});

export default connect(
	mapStateToProps,
	{ toggleCreateAnnouncement, createAnnouncement }
)(Announcements);
