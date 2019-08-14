import React from 'react';
import { EditorState, convertFromRaw } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import createLinkifyPlugin from 'draft-js-linkify-plugin';
import createImagePlugin from 'draft-js-image-plugin';
import createEmojiPlugin from 'draft-js-emoji-plugin';
import MultiDecorator from 'draft-js-plugins-editor/lib/Editor/MultiDecorator';
import { CompositeDecorator } from 'draft-js';

const ReadOnly = ({ contentState }) => {
	const linkifyPlugin = createLinkifyPlugin({ target: '_blank' });
	const imagePlugin = createImagePlugin();
	const emojiPlugin = createEmojiPlugin();
	const listOfPlugins = [linkifyPlugin, imagePlugin, emojiPlugin];

	const getPluginDecoratorArray = () => {
		let decorators = [];
		let plugin;
		// check each plugin that will be used in the editor for decorators
		// (retrieve listOfPlugins however makes sense in your code)
		for (plugin of listOfPlugins) {
			if (plugin.decorators !== null && plugin.decorators !== undefined) {
				// if the plugin has any decorators, add them to a list of all decorators from all plugins
				decorators = decorators.concat(plugin.decorators);
			}
		}
		return decorators;
	};

	const myFunctionForGrabbingAllPluginDecorators = () => {
		// I can't quite remember why I had to wrap things in this exact way, but found that I ran into
		// errors if I did not both have a MultiDecorator and a CompositeDecorator wrapping
		return new MultiDecorator([
			new CompositeDecorator(getPluginDecoratorArray())
		]);
	};
	let decorator = myFunctionForGrabbingAllPluginDecorators();
	const content = contentState;
	let convertedState;
	if (content !== null) {
		convertedState = EditorState.createWithContent(
			convertFromRaw(content),
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
