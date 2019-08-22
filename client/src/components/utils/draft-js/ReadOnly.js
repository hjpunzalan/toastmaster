import React from 'react';
import { EditorState, convertFromRaw } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import createLinkifyPlugin from 'draft-js-linkify-plugin';
import createImagePlugin from 'draft-js-image-plugin';
import createEmojiPlugin from 'draft-js-emoji-plugin';
import pluginDecorator from './pluginDecorator';

const ReadOnly = ({ contentState }) => {
	const linkifyPlugin = createLinkifyPlugin({ target: '_blank' });
	const imagePlugin = createImagePlugin();
	const emojiPlugin = createEmojiPlugin();
	const listOfPlugins = [linkifyPlugin, imagePlugin, emojiPlugin];
	const decorator = pluginDecorator(listOfPlugins);
	let convertedState;
	if (contentState !== null) {
		convertedState = EditorState.createWithContent(
			convertFromRaw(JSON.parse(contentState)),
			decorator
			// THIS CAN PARSE JSON OBJECT and display
		);
	} else {
		convertedState = EditorState.createEmpty();
	}

	// const storedState = EditorState.createWithContent(
	// 	convertedState.getCurrentContent()
	// );
	return (
		<Editor
			onChange={() => {}}
			plugins={listOfPlugins}
			editorState={convertedState}
			readOnly={true}
		/>
	);
};

export default ReadOnly;
