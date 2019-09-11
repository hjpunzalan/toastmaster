import React from 'react';
import TextEditor from '../utils/draft-js/TextEditor';

const CreatePost = ({
	handleSubmit,
	handleToggle,
	title,
	setTitle,
	type,
	contentState,
	withPlainText
}) => {
	return (
		<div className="CreatePost">
			<button className="btn btn__cancel" onClick={handleToggle}>
				Cancel
			</button>
			{type !== 'edit' && (
				<h1 className="CreatePost__title">Submit a new {type}</h1>
			)}
			<div className="CreatePost__form">
				<label htmlFor="title" className="CreatePost__label">
					Title:
				</label>
				<input
					id="title"
					type="text"
					name="title"
					placeholder="Insert Title"
					value={title}
					onChange={e => setTitle(e.target.value)}
					maxLength={80} // so it doesnt pollute the post too much
				/>
				<TextEditor
					withPlainText={withPlainText}
					contentState={contentState}
					handleSubmit={handleSubmit}
				/>
			</div>
		</div>
	);
};

export default CreatePost;
