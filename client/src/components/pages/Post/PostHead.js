import React from 'react';
import Moment from 'react-moment';
import 'moment-timezone';
import ReadOnly from '../../../utils/draft-js/ReadOnly';

const PostHead = ({
	post,
	img,
	currentUser,
	handleToggleEditPost,
	handleDeletePost
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
					{post.user.firstName}
					<br /> {post.user.lastName}
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
					{post.lastEdited && (
						<span className="Post__postBody-edited">
							Last edited:
							<Moment tz="Australia/Perth" format="ddd MMM DD YYYY HH:mm">
								{post.lastEdited}
							</Moment>
						</span>
					)}
					{currentUser._id === post.user._id && (
						<div className="Post__postButtons">
							<button
								className="Post__postButtons-edit"
								onClick={handleToggleEditPost}>
								Edit
							</button>
							<button
								className="Post__postButtons-delete"
								onClick={handleDeletePost}>
								Delete
							</button>
						</div>
					)}
				</>
			</div>
		</div>
	);
};

export default PostHead;
