import React from 'react';
import { EditorState, convertFromRaw } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import createLinkifyPlugin from 'draft-js-linkify-plugin';
import createImagePlugin from 'draft-js-image-plugin';

const ReadOnly = ({ onChange, state }) => {
	const linkifyPlugin = createLinkifyPlugin();
	const imagePlugin = createImagePlugin();
	const content = window.localStorage.getItem('content');
	let convertedState;
	if (content) {
		convertedState = EditorState.createWithContent(
			convertFromRaw(JSON.parse(content))
			// THIS CAN PARSE JSON OBJECT and display
		);
	} else {
		convertedState = EditorState.createEmpty();
	}

	// const storedState = EditorState.createWithContent(
	// 	convertedState.getCurrentContent()
	// );
	return (
		<div className="readonly-editor">
			<Editor
				onChange={onChange}
				plugins={[linkifyPlugin, imagePlugin]}
				editorState={state}
				readOnly={true}
			/>
		</div>
	);
};

export default ReadOnly;
