import React from 'react';

export const renderMark = (props, editor, next) => {
	switch (props.mark.type) {
		case 'bold':
			return <strong>{props.children}</strong>;
		// Add our new mark renderers...
		case 'code':
			return <code>{props.children}</code>;
		case 'italic':
			return <em>{props.children}</em>;
		case 'strikethrough':
			return <del>{props.children}</del>;
		case 'underline':
			return <u>{props.children}</u>;
		default:
			return next();
	}
};
