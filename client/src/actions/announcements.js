import axios from "axios";
import {
	TOGGLE_CREATE_ANNOUNCEMENT,
	CREATE_ANNOUNCEMENT,
	GET_ALL_ANNOUNCEMENT,
	DELETE_ANNOUNCEMENT,
	UPDATE_ANNOUNCEMENT,
	LOADING_ANNOUNCEMENT_SUBMIT,
} from "./types";
import { setAlert, resetAlert } from "./alerts";
import catchAsync from "../utils/catchAsync";

// TOGGLE BETWEEN Text editor or dashboard
export const toggleEdit = () => (dispatch) => {
	// Resets alert if already exist from dashboard
	dispatch(resetAlert());
	dispatch({ type: TOGGLE_CREATE_ANNOUNCEMENT });
};

export const createAnnouncement = ({ title, contentState, plainText }) =>
	catchAsync("announcement", async (dispatch) => {
		//Reset alert to be in every post/put/patch action that calls setAlert
		dispatch(resetAlert());
		// Convert contentState object to JSON to send down to server
		const jsonContentState = JSON.stringify(contentState);
		// Call loading state to add spinner for UX
		dispatch({ type: LOADING_ANNOUNCEMENT_SUBMIT });

		// Send title, contentstate and plainText version of contentstate to server
		const res = await axios.post("/api/announcements", {
			title,
			contentState: jsonContentState,
			plainText,
		});

		// Dispatch create announcement action and update announcement state
		dispatch({
			type: CREATE_ANNOUNCEMENT,
			payload: res.data,
		});

		// Dispatch alert to user
		dispatch(setAlert("New announcement posted!", "success"));
	});

export const getAnnouncements = () =>
	catchAsync("announcement", async (dispatch) => {
		// Only show the 10 recently updated announcements! (eg. by date)
		// @todo show all with pagination
		const limit = 10; //limit to 10 docs
		const res = await axios.get(
			`/api/announcements?sort=-lastEdited&limit=${limit}`
		);
		dispatch({ type: GET_ALL_ANNOUNCEMENT, payload: res.data });
	});

export const updateAnnouncement = ({
	id,
	newTitle,
	newContentState,
	plainText,
}) =>
	catchAsync("announcement", async (dispatch) => {
		//Reset alert to be in every post/put/patch action that calls setAlert
		dispatch(resetAlert());
		// Call loading state to add spinner for UX
		dispatch({ type: LOADING_ANNOUNCEMENT_SUBMIT });
		// Convert contentState object to JSON to send down to server
		const jsonContentState = JSON.stringify(newContentState);
		// Using announcement id, patch announcement including title, contentstate and plainText
		const res = await axios.patch(`/api/announcements/${id}`, {
			title: newTitle,
			contentState: jsonContentState,
			plainText,
		});
		// Dispatch create announcement action and update announcement state
		dispatch({ type: UPDATE_ANNOUNCEMENT, payload: res.data });
		// Dispatch alert to user
		dispatch(setAlert("Announcement updated", "success"));
	});

export const deleteAnnouncement = (id) =>
	catchAsync("announcement", async (dispatch) => {
		// Create a user prompt before deleting as protection
		if (window.confirm("Are you sure you want to delete the announcement?")) {
			//Reset alert to be in every post/put/patch action that calls setAlert
			dispatch(resetAlert());
			// Call loading state to add spinner for UX
			dispatch({ type: LOADING_ANNOUNCEMENT_SUBMIT });
			// Delete announcement given announcement id
			await axios.delete(`/api/announcements/${id}`);
			// Update announcement state
			dispatch({ type: DELETE_ANNOUNCEMENT, payload: id });
			// Dispatch alert to user
			dispatch(setAlert("Announcement removed", "success"));
		} else return;
	});
