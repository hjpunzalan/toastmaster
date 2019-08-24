import React from 'react';
import { IoIosTrash } from 'react-icons/io';
import ReadOnly from '../../../utils/draft-js/ReadOnly';
import Moment from 'react-moment';
import 'moment-timezone';

const PostComment = ({ img, contentState, user, id, date }) => {
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
				<div className="Post__bottom">
					<span className="Post__commentBody-date">
						{' '}
						<Moment tz="Australia/Perth" format="ddd MMM DD YYYY HH:mm">
							{date}
						</Moment>
					</span>
					<IoIosTrash className="Post__comment-trash" />
				</div>
			</div>
		</div>
	);
};

export default PostComment;
