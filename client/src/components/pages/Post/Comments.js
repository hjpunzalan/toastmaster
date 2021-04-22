import React from "react";
import Moment from "react-moment";
import "moment-timezone";
import { IoIosTrash } from "react-icons/io";
import ReadOnly from "../../utils/draft-js/ReadOnly";

const PostComment = ({
	img,
	contentState,
	user,
	postId,
	id,
	date,
	deleteComment,
	history,
	page,
	setPage,
	currentUser,
	Moderator,
}) => {
		let userNameLength = user.firstName.length + user.lastName.length;
	let convertedName = user.firstName + " " + user.lastName[0].toUpperCase()
	if(userNameLength > 20) convertedName = user.firstName[0].toUpperCase() + user.lastName[0].toUpperCase()
	return (
		<div className="Post__comment">
			<div className="Post__commentUser">
				<img
					src={user.photo || img}
					alt="user-logo"
					className="Post__commentUser-img"
				/>
				<span className="Post__commentUser-name">
				{userNameLength > 12 && window.screen.width > 1000? <span>{convertedName}</span> :<>
					<span>{user.firstName}&nbsp;</span>
						<span>{user.lastName}</span></>}
				</span>
			</div>
			<div className="Post__commentBody">
				<div className="Post__commentBody-text">
					<ReadOnly contentState={contentState} />
				</div>
				<div className="Post__commentBottom">
					<span className="Post__commentBody-date">
						<Moment tz="Australia/Perth" format="ddd MMM DD YYYY HH:mm">
							{date}
						</Moment>
					</span>
					{(currentUser._id === user._id ||
						(Moderator && currentUser.role === "admin")) && (
						<button
							className="Post__comment-trash"
							onClick={() =>
								deleteComment({ postId, commentId: id, history, page, setPage })
							}>
							<IoIosTrash />
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default PostComment;
