import React from 'react';
import { Editor, EditorState } from 'draft-js';

const PostEdit = () => {
	const [editorState, setEditorState] = React.useState(
		EditorState.createEmpty()
	);

	return (
		<div>
			<Editor editorState={editorState} onChange={setEditorState} />
		</div>
	);
};

export default PostEdit;
