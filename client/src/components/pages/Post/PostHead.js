import React from "react";
import Moment from "react-moment";
import "moment-timezone";
import ReadOnly from "../../utils/draft-js/ReadOnly";

const PostHead = ({
	post,
	img,
	currentUser,
	toggleEditPost,
	handleDeletePost,
	Moderator,
}) => {
	return (
		<div className="Post__post">
			<div className="Post__postUser">
				<img
					src={post.user.photo || img}
					alt="user-logo"
					className="Post__postUser-img"
				/>
				<span className="Post__postUser-name">
					<span>{post.user.firstName}&nbsp;</span>
					{(post.user.firstName.length <= 10 ||
						post.user.lastName.length <= 10) && (
						<span>{post.user.lastName}</span>
					)}
				</span>
			</div>
			<div className="Post__postBody">
				<div className="Post__postBody-text">
					<ReadOnly contentState={post.contentState} />
				</div>
				<>
					<span className="Post__postBody-date">
						Posted:
						<Moment tz="Australia/Perth" format="ddd MMM DD YYYY HH:mm">
							{post.date}
						</Moment>
					</span>
					{post.lastEdited !== post.date && (
						<span className="Post__postBody-edited">
							Last edited:
							<Moment tz="Australia/Perth" format="ddd MMM DD YYYY HH:mm">
								{post.lastEdited}
							</Moment>
						</span>
					)}
					<div className="Post__postButtons">
						{currentUser._id === post.user._id && (
							<button className="btn btn__edit-xs" onClick={toggleEditPost}>
								Edit
							</button>
						)}
						{(currentUser._id === post.user._id ||
							(Moderator && currentUser.role === "admin")) && (
							<button className="btn btn__delete-xs" onClick={handleDeletePost}>
								Delete
							</button>
						)}
					</div>
				</>
			</div>
		</div>
	);
};

export default PostHead;
