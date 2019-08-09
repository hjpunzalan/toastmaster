import React from 'react';

export const renderMark = (props, editor, next) => {
	const { children, mark, attributes } = props;

	switch (mark.type) {
		case 'bold':
			return <strong {...attributes}>{children}</strong>;
		case 'code':
			return <code {...attributes}>{children}</code>;
		case 'italic':
			return <em {...attributes}>{children}</em>;
		case 'underlined':
			return <u {...attributes}>{children}</u>;
		default:
			return next();
	}
};

export const renderBlock = (props, editor, next) => {
	const { attributes, children, node } = props;

	switch (node.type) {
		case 'block-quote':
			return (
				<blockquote className="Editor__blockquote" {...attributes}>
					{children}
				</blockquote>
			);
		case 'bulleted-list':
			return <ul {...attributes}>{children}</ul>;
		case 'heading-one':
			return <h1 {...attributes}>{children}</h1>;
		case 'heading-two':
			return <h2 {...attributes}>{children}</h2>;
		case 'list-item':
			return <li {...attributes}>{children}</li>;
		case 'numbered-list':
			return <ol {...attributes}>{children}</ol>;
		default:
			return next();
	}
};
