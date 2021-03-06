import React, { Component } from 'react';
import { connect } from 'react-redux';
import { IoMdQuote } from 'react-icons/io';
import { GoListOrdered, GoListUnordered } from 'react-icons/go';
import { FaBold, FaItalic, FaUnderline } from 'react-icons/fa';
import Editor, { composeDecorators } from '@draft-js-plugins/editor';
import createLinkifyPlugin from '@draft-js-plugins/linkify';
import createImagePlugin from '@draft-js-plugins/image';
import createFocusPlugin from '@draft-js-plugins/focus';
import createBlockDndPlugin from '@draft-js-plugins/drag-n-drop';
import createResizeablePlugin from '@draft-js-plugins/resizeable';
import {
	convertToRaw,
	convertFromRaw,
	EditorState,
	RichUtils,
	getDefaultKeyBinding,
	KeyBindingUtil,
	Modifier
} from 'draft-js';
import ImageAdd from './ImageAdd/ImageAdd';
import pluginDecorator from './pluginDecorator';
import { onChange } from '../../../actions/textEditor';

// This fixes cannot delete child from node error when backspace of links
const HANDLED = 'handled';
const { hasCommandModifier } = KeyBindingUtil;
const linkifyPlugin = createLinkifyPlugin({
	//This gets rid of blockkey error warnings
	component: ({ blockKey, ...rest }) => (
		// eslint-disable-next-line no-alert, jsx-a11y/anchor-has-content
		<a {...rest} blockkey={blockKey} target="_blank" />
	)
});
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
	blockDndPlugin,
	resizeablePlugin,
	focusPlugin,
	imagePlugin
];
const decorator = pluginDecorator(listOfPlugins);

class TextEditor extends Component {
	constructor(props) {
		super(props);
		this.state = {
			editorState: this.props.contentState
				? EditorState.createWithContent(
						convertFromRaw(JSON.parse(this.props.contentState)),
						decorator
				  )
				: EditorState.createEmpty(),
			plainText: ''
		}; //Always makes a new content whenever rendered
	}
	componentDidCatch() {
		this.forceUpdate();
	}

	focus = () => this.editor.focus();

	onChange = editorState => {
		this.setState({
			editorState,
			plainText: this.state.editorState.getCurrentContent().getPlainText()
		});
		this.props.onChange(
			convertToRaw(editorState.getCurrentContent()) // Sends the content to redux state
		);
	};

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

	handleKeyCommand = (command, editorState) => {
		const newState = RichUtils.handleKeyCommand(editorState, command);
		if (newState) {
			this.onChange(newState);
			return true;
		}
		return false;
	};
	mapKeyToEditorCommand = e => {
		if (e.keyCode === 83 /* `S` key */ && hasCommandModifier(e)) {
			return 'myeditor-save';
		}
		return getDefaultKeyBinding(e);
	};
	toggleBlockType = blockType => {
		this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType));
	};
	toggleInlineStyle = inlineStyle => {
		this.onChange(
			RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle)
		);
	};

	handleSubmit = () => {
		const text = this.state.plainText;
		if (text.length === 0) return;
		// prevent closure memory leak
		this.props.handleSubmit(text);
		this.setState({ editorState: EditorState.createEmpty() }); // Whenever submit is pressed, the current state of editor will reset
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
						/>
					</div>
					<div className={className} onClick={this.focus}>
						<Editor
							blockStyleFn={getBlockStyle}
							// handleBeforeInput={this.handleBeforeInput}
							editorState={editorState}
							handleKeyCommand={this.handleKeyCommand}
							keyBindingFn={this.mapKeyToEditorCommand}
							onChange={this.onChange}
							placeholder="Write something..."
							ref={element => {
								this.editor = element;
							}}
							spellCheck={true}
							plugins={listOfPlugins}
						/>
					</div>
				</div>
				<button className="btn btn__submit" onClick={this.handleSubmit}>
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
