import React, { useState } from 'react';
import { Editor } from 'slate-react';
import { Value } from 'slate';
import plugins from '../plugins/plugins';
import { renderMark, renderBlock } from './renderers';
import { Button, Icon, Toolbar } from '../components';
import initialValue from './initialValue';

// APP
const TextEditor = () => {
	const DEFAULT_NODE = 'paragraph';
	let newEditor;

	const existingValue = JSON.parse(localStorage.getItem('content'));
	const [text, setText] = useState({
		value: Value.fromJSON(existingValue || initialValue)
	});

	const hasMark = type => {
		const { value } = text;
		return value.activeMarks.some(mark => mark.type === type);
	};

	const hasBlock = type => {
		const { value } = text;
		return value.blocks.some(node => node.type === type);
	};

	//  ------------- EVENT HANDLERS --------------------
	const onChange = ({ value }) => {
		// eslint-disable-next-line
		if (value.document != text.value.document) {
			const content = JSON.stringify(value.toJSON());
			localStorage.setItem('content', content);
		}
		setText({ value });
	};

	const ref = editor => {
		newEditor = editor;
	};

	// -------------------COMPONENTS ----------------------
	const renderMarkButton = (type, icon) => {
		const isActive = hasMark(type);

		return (
			<Button active={isActive} onMouseDown={event => onClickMark(event, type)}>
				<Icon>{icon}</Icon>
			</Button>
		);
	};

	const renderBlockButton = (type, icon) => {
		let isActive = hasBlock(type);

		if (['numbered-list', 'bulleted-list'].includes(type)) {
			const {
				value: { document, blocks }
			} = text;

			if (blocks.size > 0) {
				const parent = document.getParent(blocks.first().key);
				isActive = hasBlock('list-item') && parent && parent.type === type;
			}
		}

		return (
			<Button
				active={isActive}
				onMouseDown={event => onClickBlock(event, type)}>
				<Icon>{icon}</Icon>
			</Button>
		);
	};

	const onClickMark = (event, type) => {
		event.preventDefault();
		newEditor.toggleMark(type);
	};

	const onClickBlock = (event, type) => {
		event.preventDefault();

		const editor = newEditor;
		const { value } = editor;
		const { document } = value;

		// Handle everything but list buttons.
		if (type !== 'bulleted-list' && type !== 'numbered-list') {
			const isActive = hasBlock(type);
			const isList = hasBlock('list-item');

			if (isList) {
				editor
					.setBlocks(isActive ? DEFAULT_NODE : type)
					.unwrapBlock('bulleted-list')
					.unwrapBlock('numbered-list');
			} else {
				editor.setBlocks(isActive ? DEFAULT_NODE : type);
			}
		} else {
			// Handle the extra wrapping required for list buttons.
			const isList = hasBlock('list-item');
			const isType = value.blocks.some(block => {
				return !!document.getClosest(block.key, parent => parent.type === type);
			});

			if (isList && isType) {
				editor
					.setBlocks(DEFAULT_NODE)
					.unwrapBlock('bulleted-list')
					.unwrapBlock('numbered-list');
			} else if (isList) {
				editor
					.unwrapBlock(
						type === 'bulleted-list' ? 'numbered-list' : 'bulleted-list'
					)
					.wrapBlock(type);
			} else {
				editor.setBlocks('list-item').wrapBlock(type);
			}
		}
	};

	return (
		<div className="Editor">
			<div className="Editor__textbox">
				<Toolbar>
					{renderMarkButton('bold', 'format_bold')}
					{renderMarkButton('italic', 'format_italic')}
					{renderMarkButton('underlined', 'format_underlined')}
					{renderBlockButton('heading-one', 'looks_one')}
					{renderBlockButton('heading-two', 'looks_two')}
					{renderBlockButton('block-quote', 'format_quote')}
					{renderBlockButton('numbered-list', 'format_list_numbered')}
					{renderBlockButton('bulleted-list', 'format_list_bulleted')}
				</Toolbar>
				<Editor
					ref={ref}
					spellCheck
					autoFocus
					plugins={plugins}
					value={text.value}
					onChange={onChange}
					renderBlock={renderBlock}
					renderMark={renderMark}
				/>
			</div>
		</div>
	);
};

export default TextEditor;
