const rules = [
	// Add our first rule with a deserializing function.
	{
		deserialize(el, next) {
			// eslint-disable-next-line
			if (el.tagName.toLowerCase() == 'p') {
				return {
					object: 'block',
					type: 'paragraph',
					data: {
						className: el.getAttribute('class')
					},
					nodes: next(el.childNodes)
				};
			}
		}
	}
];

export default rules;
