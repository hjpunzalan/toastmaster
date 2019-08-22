import React from 'react';
import { EditorState, convertFromRaw } from 'draft-js';
import Editor, { composeDecorators } from 'draft-js-plugins-editor';
import createLinkifyPlugin from 'draft-js-linkify-plugin';
import createImagePlugin from 'draft-js-image-plugin';
import createEmojiPlugin from 'draft-js-emoji-plugin';
import createFocusPlugin from 'draft-js-focus-plugin';
import createBlockDndPlugin from 'draft-js-drag-n-drop-plugin';
import createResizeablePlugin from 'draft-js-resizeable-plugin';
import pluginDecorator from './pluginDecorator';
import theme from './emojiPlugin';

let editor;
const emojiPlugin = createEmojiPlugin({ theme });
const linkifyPlugin = createLinkifyPlugin();
const focusPlugin = createFocusPlugin();
const blockDndPlugin = createBlockDndPlugin();
const resizeablePlugin = createResizeablePlugin();
const imageDecorator = composeDecorators(
	focusPlugin.decorator,
	blockDndPlugin.decorator,
	resizeablePlugin.decorator
);
const imagePlugin = createImagePlugin({ decorator: imageDecorator });
const listOfPlugins = [
	linkifyPlugin,
	emojiPlugin,
	blockDndPlugin,
	resizeablePlugin,
	focusPlugin,
	imagePlugin
];
const decorator = pluginDecorator(listOfPlugins);

export default class ReadOnly extends React.Component {
	render() {
		const { contentState } = this.props;
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

		const focus = () => {
			editor.focus();
		};

		// const storedState = EditorState.createWithContent(
		// 	convertedState.getCurrentContent()
		// );
		return (
			<div className="RichEditor-ReadOnly" onClick={focus}>
				<Editor
					onChange={() => {}}
					plugins={listOfPlugins}
					editorState={convertedState}
					ref={element => {
						editor = element;
					}}
					readOnly={true}
				/>
			</div>
		);
	}
}
