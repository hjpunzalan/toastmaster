import { ON_CHANGE } from '../actions/types';

const initialState = {
	contentState: {}
};

export default (state = initialState, action) => {
	const { payload, type } = action;
	switch (type) {
		case ON_CHANGE:
			return {
				...state,
				contentState: payload
			};

		default:
			return state;
	}
};
