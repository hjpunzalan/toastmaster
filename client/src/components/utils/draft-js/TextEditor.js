import React, { Component } from 'react';
import { connect } from 'react-redux';
import { onChange } from '../../../actions/post';
import { IoMdQuote } from 'react-icons/io';
import { GoListOrdered, GoListUnordered } from 'react-icons/go';
import { FaBold, FaItalic, FaUnderline } from 'react-icons/fa';
import Editor, { composeDecorators } from 'draft-js-plugins-editor';
import createLinkifyPlugin from 'draft-js-linkify-plugin';
import createImagePlugin from 'draft-js-image-plugin';
import createEmojiPlugin from 'draft-js-emoji-plugin';
import createFocusPlugin from 'draft-js-focus-plugin';
import createBlockDndPlugin from 'draft-js-drag-n-drop-plugin';
import createResizeablePlugin from 'draft-js-resizeable-plugin';
import {
	Modifier,
	convertToRaw,
	EditorState,
	RichUtils,
	getDefaultKeyBinding,
	KeyBindingUtil
} from 'draft-js';
import ImageAdd from './ImageAdd/ImageAdd';
import linkifyEditorState from './linkifyEditorState';
import theme from './emojiPlugin';

const { hasCommandModifier } = KeyBindingUtil;
const HANDLED = 'handled';
const emojiPlugin = createEmojiPlugin({ theme });
const { EmojiSuggestions, EmojiSelect } = emojiPlugin;
const linkifyPlugin = createLinkifyPlugin();
const focusPlugin = createFocusPlugin();
const blockDndPlugin = createBlockDndPlugin();
const resizeablePlugin = createResizeablePlugin();

const decorator = composeDecorators(
	focusPlugin.decorator,
	blockDndPlugin.decorator,
	resizeablePlugin.decorator
);
const imagePlugin = createImagePlugin({ decorator });
const plugins = [
	linkifyPlugin,
	emojiPlugin,
	blockDndPlugin,
	resizeablePlugin,
	focusPlugin,
	imagePlugin
];

class TextEditor extends Component {
	constructor(props) {
		super(props);
		this.state = { editorState: EditorState.createEmpty() };
		this.focus = () => this.editor.focus();
		this.onChange = editorState => {
			this.setState({ editorState });
			this.props.onChange(linkifyEditorState(editorState).getCurrentContent());
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
		if (e.keyCode === 83 /* `S` key */ && hasCommandModifier(e)) {
			return 'myeditor-save';
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
			<>
				<div className="RichEditor-root">
					<div className="RichEditor-root__controls">
						<InlineStyleControls
							editorState={editorState}
							onToggle={this.toggleInlineStyle}
						/>
						<BlockStyleControls
							editorState={editorState}
							onToggle={this.toggleBlockType}
							onChange={this.onChange}
							emojiPlugin={emojiPlugin}
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
							plugins={plugins}
						/>
						<EmojiSuggestions />
					</div>
				</div>
				<button className="btn btn__submit" onClick={this.props.handleSubmit}>
					Submit
				</button>
			</>
		);
	}
}

export default connect(
	null,
	{ onChange }
)(TextEditor);
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
			<EmojiSelect />
		</div>
	);
};
