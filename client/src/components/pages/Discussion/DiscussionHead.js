import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import TextEditor from '../../utils/draft-js/TextEditor';

const DiscussionHead = () => {
	const [toggleCreate, setToggleCreate] = useState(false);

	const handleToggle = () => {
		toggleCreate ? setToggleCreate(false) : setToggleCreate(true);
	};
	return (
		<div className="Discussion__head">
			{!toggleCreate ? (
				<>
					<button className="btn btn__submit" onClick={handleToggle}>
						Create a new post
					</button>
					<form className="Discussion__search">
						<input type="text" name="search" placeholder="Search all posts" />
						<FaSearch className="Discussion__search-searchIcon" />
					</form>{' '}
				</>
			) : (
				<div className="Discussion__create">
					<button className="btn btn__cancel" onClick={handleToggle}>
						Cancel
					</button>
					<h1 className="Discussion__create-title">Submit a new post</h1>
					<div className="Discussion__create-form">
						<label htmlFor="title" className="Discussion__create-formLabel">
							Title:
						</label>
						<input type="text" name="title" placeholder="Insert Title" />
						<TextEditor />
						<button className="btn btn__submit">Submit</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default DiscussionHead;
