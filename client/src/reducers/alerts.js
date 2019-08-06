import { SET_ALERT, RESET_ALERT } from '../actions/types';

const initialState = {
	msg: [],
	alertType: null
};

export default (state = initialState, action) => {
	const { type, payload } = action;
	switch (type) {
		case SET_ALERT:
			return {
				...state,
				msg: [...state.msg, payload.msg],
				alertType: payload.alertType
			};
		case RESET_ALERT:
			return {
				...initialState
			};

		default:
			return state;
	}
};
