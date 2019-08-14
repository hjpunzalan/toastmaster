import React, { useState } from 'react';
import TextEditor from '../../../utils/draft-js/TextEditor';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { updatePost } from '../../../../actions/post';

const PostEditor = ({
	updatePost,
	handleToggle,
	title,
	contentState,
	postId,
	textEditor
}) => {
	const [newTitle, setTitle] = useState(title);

	const handleSubmit = () => {
		const newContentState = textEditor.contentState;
		updatePost({ postId, newTitle, newContentState });
	};
	return (
		<div className="Discussion__create">
			<button className="btn btn__cancel" onClick={handleToggle}>
				Cancel
			</button>
			<div className="Discussion__create-form">
				<label htmlFor="title" className="Discussion__create-formLabel">
					Title:
				</label>
				<input
					type="text"
					name="title"
					placeholder="Insert Title"
					value={newTitle}
					onChange={e => setTitle(e.target.value)}
					maxLength={80} // so it doesnt pollute the post too much
				/>
				<TextEditor contentState={contentState} handleSubmit={handleSubmit} />
			</div>
		</div>
	);
};

PostEditor.propTypes = {
	updatePost: PropTypes.func.isRequired,
	contentState: PropTypes.object.isRequired,
	textEditor: PropTypes.object.isRequired
};

export default connect(
	null,
	{ updatePost }
)(PostEditor);
