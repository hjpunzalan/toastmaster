import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import TextEditor from '../../utils/draft-js/TextEditor';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createPost, toggleCreatePost } from '../../../actions/post';
import { resetAlert } from '../../../actions/alerts';

const DiscussionHead = ({
	createPost,
	contentState,
	resetAlert,
	edit,
	toggleCreatePost
}) => {
	const [title, setTitle] = useState('');

	const handleToggle = () => {
		resetAlert();
		toggleCreatePost(edit);
	};

	const handleSubmit = () => {
		createPost({ title, contentState });
		setTitle('');
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
							maxLength={80}
						/>
						<TextEditor handleSubmit={handleSubmit} />
					</div>
				</div>
			)}
		</div>
	);
};

DiscussionHead.propTypes = {
	createPost: PropTypes.func.isRequired,
	contentState: PropTypes.object.isRequired,
	edit: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
	contentState: state.post.contentState,
	edit: state.post.edit
});

export default connect(
	mapStateToProps,
	{ createPost, resetAlert, toggleCreatePost }
)(DiscussionHead);
