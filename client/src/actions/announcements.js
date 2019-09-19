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

export const toggleEdit = () => dispatch => {
	dispatch(resetAlert());
	dispatch({ type: TOGGLE_CREATE_ANNOUNCEMENT });
};

export const createAnnouncement = (title, contentState, plainText) =>
	catchAsync('announcement', async dispatch => {
		dispatch(resetAlert()); //Need to be in every post/put/patch action with alert
		const jsonContentState = JSON.stringify(contentState);
		// This makes it more UX friendly calling a spinner instantly
		dispatch({ type: LOADING_ANNOUNCEMENT_SUBMIT });
		// Need to be in edit also
		const body = { title, contentState: jsonContentState, plainText };
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
		const limit = 10; //limit to 10 docs
		const res = await axios.get(
			`/api/announcements?sort=-lastEdited,-date&limit=${limit}`
		);
		dispatch({ type: GET_ALL_ANNOUNCEMENT, payload: res.data });
	});

export const updateAnnouncement = (id, newTitle, newContentState, plainText) =>
	catchAsync('announcement', async dispatch => {
		dispatch(resetAlert());
		dispatch({ type: LOADING_ANNOUNCEMENT_SUBMIT });
		const jsonContentState = JSON.stringify(newContentState);
		const res = await axios.patch(
			`/api/announcements/${id}`,
			{
				title: newTitle,
				contentState: jsonContentState,
				plainText
			},
			{
				headers: {
					'Content-type': 'application/json'
				}
			}
		);
		dispatch({ type: UPDATE_ANNOUNCEMENT, payload: res.data });
		dispatch(setAlert('Announcement updated', 'success'));
	});

export const deleteAnnouncement = id =>
	catchAsync('announcement', async dispatch => {
		if (window.confirm('Are you sure you want to delete the announcement?')) {
			dispatch(resetAlert());
			dispatch({ type: LOADING_ANNOUNCEMENT_SUBMIT });
			await axios.delete(`/api/announcements/${id}`);
			dispatch({ type: DELETE_ANNOUNCEMENT, payload: id });
			dispatch(setAlert('Announcement removed', 'success'));
		} else return;
	});
