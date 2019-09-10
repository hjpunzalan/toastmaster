import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import 'moment-timezone';
import {
	toggleEdit,
	createAnnouncement,
	updateAnnouncement,
	deleteAnnouncement
} from '../../../actions/announcements';
import CreatePost from '../../utils/CreatePost';
import ReadOnly from '../../utils/draft-js/ReadOnly';

const Announcements = ({
	users: { Moderator },
	toggleEdit,
	createAnnouncement,
	updateAnnouncement,
	deleteAnnouncement,
	announcements: { edit, announcements },
	textEditor: { contentState }
}) => {
	const [title, setTitle] = useState('');
	const [id, setId] = useState(null);
	const [type, setType] = useState('announcement');
	const [contentEdit, setContentEdit] = useState(null);
	useEffect(() => {
		if (edit) toggleEdit();
		// eslint-disable-next-line
	}, []);

	// Announcement handlers
	const handleToggle = () => {
		setType('announcement');
		toggleEdit();
		setTitle('');
	};

	const handleSubmit = () => {
		createAnnouncement(title, contentState);
		setTitle('');
	};

	const handleEdit = (postId, currentTitle, contentState) => {
		setType('edit');
		setTitle(currentTitle);
		setId(postId);
		setContentEdit(contentState);
		toggleEdit();
	};

	const handleUpdate = () => {
		// title from state, contentState from textEditor
		updateAnnouncement(id, title, contentState);
	};
	// updateAnnouncement(id, title, contentState);

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
				handleSubmit={type === 'edit' ? handleUpdate : handleSubmit}
				contentState={type === 'edit' && contentEdit}
				type={type}
			/>
		</div>
	) : (
		<div className="Dashboard__left">
			<div className="Dashboard__top">
				{Moderator && (
					<button className="btn btn__submit" onClick={toggleEdit}>
						Post new announcement
					</button>
				)}
			</div>
			<div className="Dashboard__announcements">
				{announcements[0] && (
					<div className="Dashboard__announcement">
						<h1 className="Dashboard__announcement-title">
							{announcements[0].title}
						</h1>
						<ReadOnly contentState={announcements[0].contentState} />
						<div className="Dashboard__announcement-bottom">
							{announcements[0].lastEdited > announcements[0].date ? (
								<span>
									Edited: &nbsp;
									<Moment tz="Australia/Perth" format="ddd MMM DD YYYY HH:mm">
										{announcements[0].lastEdited}
									</Moment>
								</span>
							) : (
								<Moment tz="Australia/Perth" format="ddd MMM DD YYYY HH:mm">
									{announcements[0].date}
								</Moment>
							)}
						</div>
						{Moderator && (
							<div className="Dashboard__announcement-buttons">
								<button
									className="btn btn__edit-xs"
									onClick={() =>
										handleEdit(
											announcements[0]._id,
											announcements[0].title,
											announcements[0].contentState
										)
									}>
									Edit
								</button>
								<button
									className="btn btn__delete-xs"
									onClick={() => deleteAnnouncement(announcements[0]._id)}>
									Delete
								</button>
							</div>
						)}
					</div>
				)}
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
						<h1 className="Dashboard__announcement-title">{el.title}</h1>
						<ReadOnly contentState={el.contentState} />
						<div className="Dashboard__announcement-bottom">
							{el.lastEdited > el.date ? (
								<span>
									Edited: &nbsp;
									<Moment tz="Australia/Perth" format="ddd MMM DD YYYY HH:mm">
										{el.lastEdited}
									</Moment>
								</span>
							) : (
								<Moment tz="Australia/Perth" format="ddd MMM DD YYYY HH:mm">
									{el.date}
								</Moment>
							)}
						</div>
						{Moderator && (
							<div className="Dashboard__announcement-buttons">
								<button
									className="btn btn__edit-xs"
									onClick={() => handleEdit(el._id, el.title, el.contentState)}>
									Edit
								</button>
								<button
									className="btn btn__delete-xs"
									onClick={() => deleteAnnouncement(el._id)}>
									Delete
								</button>
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
};

Announcements.propTypes = {
	users: PropTypes.object.isRequired,
	toggleEdit: PropTypes.func.isRequired,
	createAnnouncement: PropTypes.func.isRequired,
	updateAnnouncement: PropTypes.func.isRequired,
	deleteAnnouncement: PropTypes.func.isRequired,
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
	{
		toggleEdit,
		createAnnouncement,
		updateAnnouncement,
		deleteAnnouncement
	}
)(Announcements);

/*
Need to add restriction in server for editing announcements or maybe removed author
*/
