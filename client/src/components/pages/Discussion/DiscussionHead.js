import React from 'react';
import { FaSearch } from 'react-icons/fa';

const DiscussionHead = () => {
	return (
		<div className="Discussion__head">
			<button className="btn btn__submit">Create a new post</button>
			<form className="Discussion__search">
				<input type="text" name="search" placeholder="Search all posts" />
				<FaSearch className="Discussion__search-searchIcon" />
			</form>
		</div>
	);
};

export default DiscussionHead;
