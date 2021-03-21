import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import TextEditor from "./draft-js/TextEditor";
import { onChange } from "../../actions/textEditor";
import { ContentState, convertToRaw } from "draft-js";

// Test all component props that utilise ContentEditor

const ContentEditor = ({
	handleSubmit,
	handleToggle,
	title,
	setTitle,
	type,
	contentState,
	plainText,
	onChange,
}) => {
	useEffect(() => {
		// This is to prevent a blank post when submitting with no changes during edit
		if (plainText) {
			const textToContentState = convertToRaw(
				ContentState.createFromText(plainText)
			);
			onChange(textToContentState);
		}
		// eslint-disable-next-line
	}, []);
	// need to handlereadme
	// Handled editting by plainText
	// Handle submit contentState to be just a string instead
	// If editing from mobile, need to use plain text only

	// content is the input text value that is initialised as the post's plaintext
	const [content, setContent] = useState(plainText ? plainText : "");
	const handleChange = (e) => {
		setContent(e.target.value);
		const textToContentState = convertToRaw(
			ContentState.createFromText(e.target.value)
		);
		onChange(textToContentState);
	};

	// Added Draftjs to convert plainText to contentState
	const submitPost = () => {
		if (content.length === 0) return;
		handleSubmit(content);
	};

	// breakpoint: 1000px;
	const breakpoint = window.screen.width < 1000;
	return (
		<div className="CreatePost">
			<button className="btn__cancel" onClick={handleToggle}>
				Cancel
			</button>
			{type !== "edit" && (
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
					onChange={(e) => setTitle(e.target.value)}
					maxLength={80} // so it doesnt pollute the post too much
					required
				/>
				{breakpoint ? (
					<>
						<textarea
							className="CreatePost__editor"
							type="text"
							name="editor"
							id="editor"
							value={content}
							onChange={handleChange}
							required></textarea>
						<button className="btn btn__submit" onClick={submitPost}>
							Submit Post
						</button>
					</>
				) : (
					<TextEditor
						contentState={contentState} // context
						handleSubmit={handleSubmit} // submit function
					/>
				)}
			</div>
		</div>
	);
};

ContentEditor.propTypes = {
	onChange: PropTypes.func.isRequired,
};

export default connect(null, { onChange })(ContentEditor);
