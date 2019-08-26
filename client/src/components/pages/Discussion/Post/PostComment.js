import React from 'react';
import { IoIosTrash } from 'react-icons/io';
import ReadOnly from '../../../utils/draft-js/ReadOnly';
import Moment from 'react-moment';
import 'moment-timezone';

const PostComment = ({
	img,
	contentState,
	user,
	postId,
	id,
	date,
	deleteComment
}) => {
	return (
		<div className="Post__comment">
			<div className="Post__commentUser">
				<img src={img} alt="user-logo" className="Post__commentUser-img" />
				<span className="Post__commentUser-name">{user.firstName}</span>
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
					<button
						className="Post__comment-trash"
						onClick={() => deleteComment(postId, id)}>
						<IoIosTrash />
					</button>
				</div>
			</div>
		</div>
	);
};

export default PostComment;
