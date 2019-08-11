import React, { Component } from 'react';
import { IoMdQuote } from 'react-icons/io';
import { GoListOrdered, GoListUnordered } from 'react-icons/go';
import { FaBold, FaItalic, FaUnderline } from 'react-icons/fa';
import Editor from 'draft-js-plugins-editor';
import createLinkifyPlugin from 'draft-js-linkify-plugin';
import createImagePlugin from 'draft-js-image-plugin';
import {
	Modifier,
	convertToRaw,
	EditorState,
	RichUtils,
	getDefaultKeyBinding
} from 'draft-js';
import ImageAdd from './ImageAdd/ImageAdd';
import ReadOnly from './ReadOnly';

const HANDLED = 'handled';

export default class TextEditor extends Component {
	constructor(props) {
		super(props);
		this.state = { editorState: EditorState.createEmpty() };
		this.focus = () => this.editor.focus();
		this.onChange = editorState => {
			this.saveContent(editorState.getCurrentContent());
			this.setState({ editorState });
		};
		this.handleKeyCommand = this._handleKeyCommand.bind(this);
		this.mapKeyToEditorCommand = this._mapKeyToEditorCommand.bind(this);
		this.toggleBlockType = this._toggleBlockType.bind(this);
		this.toggleInlineStyle = this._toggleInlineStyle.bind(this);
	}
	saveContent = content => {
		window.localStorage.setItem(
			'content',
			JSON.stringify(convertToRaw(content))
			//// THIS JSON FILE CAN BE STORED IN STATE and thus DBs
		);
	};

	_handleKeyCommand(command, editorState) {
		const newState = RichUtils.handleKeyCommand(editorState, command);
		if (newState) {
			this.onChange(newState);
			return true;
		}
		return false;
	}
	_mapKeyToEditorCommand(e) {
		if (e.keyCode === 9 /* TAB */) {
			const newEditorState = RichUtils.onTab(
				e,
				this.state.editorState,
				4 /* maxDepth */
			);
			if (newEditorState !== this.state.editorState) {
				this.onChange(newEditorState);
			}
			return;
		}
		return getDefaultKeyBinding(e);
	}
	_toggleBlockType(blockType) {
		this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType));
	}
	_toggleInlineStyle(inlineStyle) {
		this.onChange(
			RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle)
		);
	}

	handleBeforeInput = (chars, editorState) => {
		const currentContentState = editorState.getCurrentContent();
		const selectionState = editorState.getSelection();

		this.onChange(
			EditorState.push(
				editorState,
				Modifier.replaceText(currentContentState, selectionState, chars)
			)
		);

		return HANDLED;
	};

	render() {
		const linkifyPlugin = createLinkifyPlugin();
		const imagePlugin = createImagePlugin();
		const { editorState } = this.state;
		// If the user changes block type before entering any text, we can
		// either style the placeholder or hide it. Let's just hide it now.
		let className = 'RichEditor-editor';
		var contentState = editorState.getCurrentContent();
		if (!contentState.hasText()) {
			if (
				contentState
					.getBlockMap()
					.first()
					.getType() !== 'unstyled'
			) {
				className += ' RichEditor-hidePlaceholder';
			}
		}

		return (
			<div className="RichEditor-root">
				<ReadOnly state={editorState} onChange={this.onChange} />
				<div className="RichEditor-root__controls">
					<InlineStyleControls
						editorState={editorState}
						onToggle={this.toggleInlineStyle}
					/>
					<BlockStyleControls
						editorState={editorState}
						onToggle={this.toggleBlockType}
						onChange={this.onChange}
					/>
				</div>
				<div className={className} onClick={this.focus}>
					<Editor
						handleBeforeInput={this.handleBeforeInput}
						blockStyleFn={getBlockStyle}
						customStyleMap={styleMap}
						editorState={editorState}
						handleKeyCommand={this.handleKeyCommand}
						keyBindingFn={this.mapKeyToEditorCommand}
						onChange={this.onChange}
						placeholder="Write something..."
						ref={element => {
							this.editor = element;
						}}
						spellCheck={true}
						plugins={[linkifyPlugin, imagePlugin]}
					/>
				</div>
			</div>
		);
	}
}
// Custom overrides for "code" style.
const styleMap = {
	CODE: {
		backgroundColor: 'rgba(0, 0, 0, 0.05)',
		fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
		fontSize: 16,
		padding: 2
	}
};
function getBlockStyle(block) {
	switch (block.getType()) {
		case 'blockquote':
			return 'RichEditor-blockquote';
		default:
			return null;
	}
}
class StyleButton extends React.Component {
	constructor() {
		super();
		this.onToggle = e => {
			e.preventDefault();
			this.props.onToggle(this.props.style);
		};
	}
	render() {
		let className = 'RichEditor-styleButton';
		if (this.props.active) {
			className += ' RichEditor-activeButton';
		}
		return (
			<span className={className} onMouseDown={this.onToggle}>
				{this.props.label}
			</span>
		);
	}
}

const BLOCK_TYPES = [
	{ label: 'H1', style: 'header-one' },
	{ label: 'H2', style: 'header-two' },
	{ label: 'H3', style: 'header-three' },
	{ label: <IoMdQuote />, style: 'blockquote' },
	{ label: <GoListUnordered />, style: 'unordered-list-item' },
	{
		label: <GoListOrdered />,
		style: 'ordered-list-item'
	}
];
const BlockStyleControls = props => {
	const { editorState, onChange } = props;
	const selection = editorState.getSelection();
	const blockType = editorState
		.getCurrentContent()
		.getBlockForKey(selection.getStartKey())
		.getType();
	return (
		<div className="RichEditor-controls">
			{BLOCK_TYPES.map((type, i) => (
				<StyleButton
					key={`${type.label}-${i}`}
					active={type.style === blockType}
					label={type.label}
					onToggle={props.onToggle}
					style={type.style}
				/>
			))}
			<ImageAdd
				editorState={editorState}
				onChange={onChange}
				modifier={createImagePlugin().addImage}
			/>
		</div>
	);
};
var INLINE_STYLES = [
	{ label: <FaBold />, style: 'BOLD' },
	{ label: <FaItalic />, style: 'ITALIC' },
	{ label: <FaUnderline />, style: 'UNDERLINE' }
];
const InlineStyleControls = props => {
	const currentStyle = props.editorState.getCurrentInlineStyle();

	return (
		<div className="RichEditor-controls">
			{INLINE_STYLES.map((type, i) => (
				<StyleButton
					key={`${type.label}-${i}`}
					active={currentStyle.has(type.style)}
					label={type.label}
					onToggle={props.onToggle}
					style={type.style}
				/>
			))}
		</div>
	);
};
