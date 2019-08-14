import React from 'react';
import { IoIosTrash } from 'react-icons/io';
import ReadOnly from '../../utils/draft-js/ReadOnly';

const PostComment = ({ img, contentState }) => {
	return (
		<div className="Post__comment">
			<div className="Post__commentUser">
				<img src={img} alt="user-logo" className="Post__commentUser-img" />
				<span className="Post__commentUser-name">Random User</span>
			</div>
			<div className="Post__commentBody">
				<div className="Post__commentBody-text">
					<ReadOnly contentState={contentState} />
				</div>
				<div className="Post__bottom">
					<span className="Post__commentBody-date">8/08/2019</span>
					<IoIosTrash className="Post__comment-trash" />
				</div>
			</div>
		</div>
	);
};

export default PostComment;
