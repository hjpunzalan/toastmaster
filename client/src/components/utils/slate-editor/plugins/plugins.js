import { MarkHotkey } from './pluginOptions';
// Create an array of plugins.
export default [
	MarkHotkey({ key: 'b', type: 'bold' }),
	MarkHotkey({ key: '`', type: 'code' }),
	MarkHotkey({ key: 'i', type: 'italic' }),
	MarkHotkey({ key: '~', type: 'strikethrough' }),
	MarkHotkey({ key: 'u', type: 'underline' })
];
