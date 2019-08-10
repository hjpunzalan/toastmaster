import React, { Component } from 'react';
import { IoMdQuote } from 'react-icons/io';
import { GoListOrdered, GoListUnordered } from 'react-icons/go';
import { FaBold, FaItalic, FaUnderline } from 'react-icons/fa';
import Editor from 'draft-js-plugins-editor';
import createLinkifyPlugin from 'draft-js-linkify-plugin';
import {
	convertToRaw,
	EditorState,
	RichUtils,
	getDefaultKeyBinding
} from 'draft-js';
import 'draft-js-linkify-plugin/lib/plugin.css';

export default class TextEditor extends Component {
	constructor(props) {
		super(props);
		this.state = { editorState: EditorState.createEmpty() };
		this.focus = () => this.refs.editor.focus();
		this.onChange = editorState => this.setState({ editorState });
		this.handleKeyCommand = this._handleKeyCommand.bind(this);
		this.mapKeyToEditorCommand = this._mapKeyToEditorCommand.bind(this);
		this.toggleBlockType = this._toggleBlockType.bind(this);
		this.toggleInlineStyle = this._toggleInlineStyle.bind(this);
	}
	convertToRaw = () => {
		this.setState({
			convertedContent: convertToRaw(this.state.editorState.getCurrentContent())
		});
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
	render() {
		const linkifyPlugin = createLinkifyPlugin();
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
				<div>
					<button onClick={this.convertToRaw}>Convert to raw</button>
					<pre>{JSON.stringify(this.state.convertedContent, null, 2)}</pre>
				</div>
				<div className="RichEditor-root__controls">
					<InlineStyleControls
						editorState={editorState}
						onToggle={this.toggleInlineStyle}
					/>
					<BlockStyleControls
						editorState={editorState}
						onToggle={this.toggleBlockType}
					/>
				</div>
				<div className={className} onClick={this.focus}>
					<Editor
						blockStyleFn={getBlockStyle}
						customStyleMap={styleMap}
						editorState={editorState}
						handleKeyCommand={this.handleKeyCommand}
						keyBindingFn={this.mapKeyToEditorCommand}
						onChange={this.onChange}
						placeholder="Write something..."
						ref="editor"
						spellCheck={true}
						plugins={[linkifyPlugin]}
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
	const { editorState } = props;
	const selection = editorState.getSelection();
	const blockType = editorState
		.getCurrentContent()
		.getBlockForKey(selection.getStartKey())
		.getType();
	return (
		<div className="RichEditor-controls">
			{BLOCK_TYPES.map(type => (
				<StyleButton
					key={type.label}
					active={type.style === blockType}
					label={type.label}
					onToggle={props.onToggle}
					style={type.style}
				/>
			))}
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
			{INLINE_STYLES.map(type => (
				<StyleButton
					key={type.label}
					active={currentStyle.has(type.style)}
					label={type.label}
					onToggle={props.onToggle}
					style={type.style}
				/>
			))}
		</div>
	);
};
