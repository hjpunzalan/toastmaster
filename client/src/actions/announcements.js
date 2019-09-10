import axios from 'axios';
import {
	TOGGLE_CREATE_ANNOUNCEMENT,
	CREATE_ANNOUNCEMENT,
	GET_ALL_ANNOUNCEMENT,
	DELETE_ANNOUNCEMENT,
	UPDATE_ANNOUNCEMENT,
	LOADING_ANNOUNCEMENT_SUBMIT
} from './types';
import { setAlert, resetAlert } from './alerts';
import catchAsync from '../utils/catchAsync';

export const toggleCreateAnnouncement = () => dispatch => {
	dispatch(resetAlert());
	dispatch({ type: TOGGLE_CREATE_ANNOUNCEMENT });
};

export const createAnnouncement = (title, contentState) =>
	catchAsync('announcement', async dispatch => {
		dispatch(resetAlert()); //Need to be in every post/put/patch action with alert
		const jsonContentState = JSON.stringify(contentState);
		// This makes it more UX friendly calling a spinner instantly
		dispatch({ type: LOADING_ANNOUNCEMENT_SUBMIT });
		// Need to be in edit also
		const body = { title, contentState: jsonContentState };
		const res = await axios.post('/api/announcements', body, {
			headers: {
				'Content-type': 'application/json'
			}
		});

		dispatch({
			type: CREATE_ANNOUNCEMENT,
			payload: res.data
		});
		dispatch(setAlert('New announcement posted!', 'success'));
	});

export const getAnnouncements = () =>
	catchAsync('announcement', async dispatch => {
		const res = await axios.get('/api/announcements?sort=-lastEdited,-date');
		dispatch({ type: GET_ALL_ANNOUNCEMENT, payload: res.data });
	});
