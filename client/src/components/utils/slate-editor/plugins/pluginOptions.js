export const MarkHotkey = options => {
	// Grab our options from the ones passed in.
	const { type, key } = options;

	return {
		onKeyDown(event, editor, next) {
			// If it doesn't match our `key`, let other plugins handle it.
			// eslint-disable-next-line
			if (!event.ctrlKey || event.key != key) return next();

			// Prevent the default characters from being inserted.
			event.preventDefault();

			// Toggle the mark `type`.
			editor.toggleMark(type);
		}
	};
};
