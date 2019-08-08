import React from 'react';
import { IoIosChatboxes } from 'react-icons/io';
import { Link } from 'react-router-dom';

const DiscussionPost = ({ img, text, count }) => {
	return (
		<Link to="/discussion/post" className="Discussion__post">
			<div className="Discussion__postUser">
				<img src={img} alt="user-logo" className="Discussion__postUser-img" />
				<span className="Discussion__postUser-name">Random Users</span>
			</div>
			<div className="Discussion__postBody">
				<div className="Discussion__postBody-header">
					<h3 className="Discussion__postBody-title"> Title</h3>
					<span className="Discussion__postBody-chat">
						{count > 0 && count}
						<IoIosChatboxes />
					</span>
				</div>
				<p className="Discussion__postBody-text">{text}</p>
				<span className="Discussion__postBody-date"> 8/08/2019</span>
			</div>
		</Link>
	);
};

export default DiscussionPost;
