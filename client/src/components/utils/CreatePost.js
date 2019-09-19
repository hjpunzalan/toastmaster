import React, { useState } from 'react';
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
	// Need a state for text field
	// Need to convert to contentState when editing
	// If editing from mobile, need to use plain text only
	// Need all post to have plain Text
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
				{window.screen.width < 1000 ? (
					<>
						<input
							className="CreatePost__editor"
							type="text"
							name="editor"
							id="editor"
						/>
						<button className="btn btn__submit">Submit Post</button>
					</>
				) : (
					<TextEditor
						withPlainText={withPlainText} //true or false
						contentState={contentState} // context
						handleSubmit={handleSubmit} // submit function
					/>
				)}
			</div>
		</div>
	);
};

export default CreatePost;
