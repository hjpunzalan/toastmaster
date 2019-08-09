import React, { useState } from 'react';
import { Editor } from 'slate-react';
import { Value } from 'slate';
import plugins from '../plugins/plugins';
import { renderMark } from './renderers';

// APP
const TextEditor = () => {
	const existingValue = JSON.parse(localStorage.getItem('content'));
	const initialValue = Value.fromJSON(
		existingValue || {
			document: {
				nodes: [
					{
						object: 'block',
						type: 'paragraph',
						nodes: [
							{
								object: 'text',
								text: 'A line of text in a paragraph.'
							}
						]
					}
				]
			}
		}
	);
	const [text, setText] = useState({
		value: initialValue
	});

	//  ------------- EVENT HANDLERS --------------------
	const onChange = ({ value }) => {
		// eslint-disable-next-line
		if (value.document != text.value.document) {
			const content = JSON.stringify(value.toJSON());
			localStorage.setItem('content', content);
		}
		setText({ value });
	};

	return (
		<>
			<Editor
				plugins={plugins}
				value={text.value}
				onChange={onChange}
				renderMark={renderMark}
			/>
		</>
	);
};

// -------------------COMPONENTS ----------------------

export default TextEditor;
