import React from 'react';
import { IoIosTrash } from 'react-icons/io';

const PostComment = ({ img, text }) => {
	return (
		<div className="Post__comments">
			<div className="Post__commentsUser">
				<img src={img} alt="user-logo" className="Post__commentsUser-img" />
				<span className="Post__commentsUser-name">Random User</span>
			</div>
			<div className="Post__commentsBody">
				<p className="Post__commentsBody-text">{text}</p>
				<div className="Post__commentsSmall">
					<span className="Post__commentsBody-date">8/08/2019</span>
					<IoIosTrash className="Post__comments-trash" />
				</div>
			</div>
		</div>
	);
};

export default PostComment;
