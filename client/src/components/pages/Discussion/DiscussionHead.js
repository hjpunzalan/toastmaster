import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import TextEditor from '../../utils/draft-js/TextEditor';

const DiscussionHead = ({
	createPost,
	contentState,
	edit,
	toggleCreatePost,
	history
}) => {
	const [title, setTitle] = useState('');

	const handleToggle = () => {
		toggleCreatePost(edit);
		setTitle(''); //when create post is canceled
	};

	const handleSubmit = plainText => {
		createPost(title, contentState, history, plainText);
	};
	return (
		<div className="Discussion__head">
			{!edit ? (
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
						<input
							type="text"
							name="title"
							placeholder="Insert Title"
							value={title}
							onChange={e => setTitle(e.target.value)}
							maxLength={80} // so it doesnt pollute the post too much
						/>
						<TextEditor handleSubmit={handleSubmit} />
					</div>
				</div>
			)}
		</div>
	);
};

export default DiscussionHead;
