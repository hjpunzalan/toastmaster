import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Moment from "react-moment";
import "moment-timezone";
import {
	toggleEdit,
	createAnnouncement,
	updateAnnouncement,
	deleteAnnouncement,
} from "../../../actions/announcements";
import CreatePost from "../../utils/CreatePost";
import ReadOnly from "../../utils/draft-js/ReadOnly";

const Announcements = ({
	users: { Moderator },
	toggleEdit,
	createAnnouncement,
	updateAnnouncement,
	deleteAnnouncement,
	announcements: { edit, announcements },
	textEditor: { contentState },
	alerts,
}) => {
	const [title, setTitle] = useState("");
	const [id, setId] = useState(null);
	const [type, setType] = useState("announcement");
	const [contentEdit, setContentEdit] = useState(null);
	const [plainTextEdit, setPlainTextEdit] = useState(null);
	useEffect(() => {
		if (edit && alerts.msg.length === 0) toggleEdit();
		// eslint-disable-next-line
	}, []);

	// Announcement handlers
	const handleToggle = () => {
		// When new post or canceled is pressed
		setType("announcement");
		toggleEdit();
		setTitle("");
	};

	const handleSubmit = (plainText) => {
		// dont need plainText
		// title from state, contentState from redux TextEditor
		createAnnouncement({ title, contentState, plainText });
		setTitle("");
	};

	const handleEdit = (
		postId,
		currentTitle,
		postContentState,
		postPlainText
	) => {
		setType("edit");
		setTitle(currentTitle);
		setId(postId);
		setContentEdit(postContentState);
		setPlainTextEdit(postPlainText);
		toggleEdit();
	};

	const handleUpdate = (plainText) => {
		// dont need plainText
		// title from state, contentState from textEditor
		updateAnnouncement({
			id,
			newTitle: title,
			newContentState: contentState,
			plainText,
		});
	};

	return edit ? (
		<div className="Dashboard__editor">
			<CreatePost
				handleToggle={handleToggle}
				title={title}
				setTitle={setTitle}
				handleSubmit={type === "edit" ? handleUpdate : handleSubmit}
				contentState={type === "edit" && contentEdit}
				type={type}
				plainText={type === "edit" && plainTextEdit}
			/>
		</div>
	) : (
		<div className="Dashboard__left">
			<div className="Dashboard__top">
				<h1 className="Dashboard__title">Announcements</h1>
				{Moderator && (
					<button className="btn__announcement" onClick={toggleEdit}>
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
											announcements[0].contentState,
											announcements[0].plainText
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
				{announcements.slice(1).map((el) => (
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
									onClick={() =>
										handleEdit(el._id, el.title, el.contentState, el.plainText)
									}>
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
	textEditor: PropTypes.object.isRequired,
	alerts: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	users: state.users,
	announcements: state.announcements,
	textEditor: state.textEditor,
	alerts: state.alerts,
});

export default connect(mapStateToProps, {
	toggleEdit,
	createAnnouncement,
	updateAnnouncement,
	deleteAnnouncement,
})(Announcements);
