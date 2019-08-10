import React from 'react';
import { Editor, EditorState, convertFromRaw } from 'draft-js';

const ReadOnly = () => {
	const content = window.localStorage.getItem('content');
	let convertedState;
	if (content) {
		convertedState = EditorState.createWithContent(
			convertFromRaw(JSON.parse(content))
		);
	} else {
		convertedState = EditorState.createEmpty();
	}

	// const storedState = EditorState.createWithContent(
	// 	convertedState.getCurrentContent()
	// );
	return (
		<div className="readonly-editor">
			<Editor editorState={convertedState} readOnly={true} />
		</div>
	);
};

export default ReadOnly;
