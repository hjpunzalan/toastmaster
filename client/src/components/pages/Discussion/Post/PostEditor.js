import React, { useState } from 'react';
import TextEditor from '../../../utils/draft-js/TextEditor';

const PostEditor = ({
	updatePost,
	handleToggle,
	title,
	contentState,
	postId,
	textEditor
}) => {
	const [newTitle, setTitle] = useState(title);

	const handleSubmit = async () => {
		const newContentState = textEditor.contentState;
		await updatePost({ postId, newTitle, newContentState });
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

export default PostEditor;
