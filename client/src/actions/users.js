import axios from "axios";
import {
	REGISTER_SUCCESS,
	UPDATE_ME,
	LOADING_AUTH,
	GET_ALL_USERS,
	TOGGLE_MODERATOR,
	DEACTIVATE_USER,
	ACTIVATE_USER,
	LOADING_USER,
	MAKE_COMMITTEE,
	REMOVE_COMMITTEE,
} from "../actions/types";
import { setAlert, resetAlert } from "./alerts";
import catchAsync from "../utils/catchAsync";

export const registerUser = (formData, url) =>
	catchAsync("user", async (dispatch) => {
		// Reset alert if there is register user error alert
		dispatch(resetAlert());
		// Deploy loading screen
		dispatch({ type: LOADING_USER });
		// send form data and current page url to send link with jwt token to user email
		const res = await axios.post("/api/users/register", { ...formData, url });
		// dispatch register action
		dispatch({ type: REGISTER_SUCCESS, payload: res.data });

		// send alert to user
		dispatch(
			setAlert(
				`${formData.firstName} ${formData.lastName} was successfully registered and temporary password sent to user's email`,
				"success"
			)
		);
	});

export const updateMe = (formData, file, history) =>
	catchAsync("update", async (dispatch) => {
		// Reset alert if there was error
		dispatch(resetAlert());
		// Deploy loading screen
		dispatch({ type: LOADING_AUTH });
		if (file) {
			// Send request for aws s3 url config
			const uploadConfig = await axios.post("/api/upload", { type: file.type });
			// Upload photo to AWS S3 bucket
			await axios.put(uploadConfig.data.url, file, {
				headers: {
					"Content-Type": file.type,
				},
			});
			// Set photo link to update user details
			formData.photo = `https://toastmaster-user-photo.s3-ap-southeast-2.amazonaws.com/${uploadConfig.data.key}`;
		}
		// Send updated user details
		const res = await axios.patch("/api/users/updateMe", formData);
		// Dispatch updated user details
		dispatch({
			type: UPDATE_ME,
			payload: res.data,
		});
		// Navigate user  back to dashboard
		history.push("/dashboard");
		// Send alert to user that details as updated
		dispatch(setAlert("User updated", "success"));
	});

export const getAllUsers = () =>
	catchAsync("users", async (dispatch) => {
		// Send request to get all user sorted by first name
		const res = await axios.get(`/api/users?sort=firstName`);

		// Dispatch results to redux state
		dispatch({
			type: GET_ALL_USERS,
			payload: res.data,
		});
	});

export const toggleView = () => (dispatch) =>
	// Change view state if user is committee or admin
	dispatch({ type: TOGGLE_MODERATOR });

export const deActivateUser = (userId) =>
	catchAsync("user", async (dispatch) => {
		// Remove any previous alert or alert from error
		dispatch(resetAlert());
		// Dispatch loading page
		dispatch({ type: LOADING_USER });
		// Send request to deactivate user
		const res = await axios.patch(`/api/users/deActivateUser/${userId}`);
		// Dispatch deactivate user action
		dispatch({ type: DEACTIVATE_USER, payload: res.data });
		// Dispatch user deactivation to current user
		dispatch(
			setAlert(
				`${res.data.firstName} ${res.data.lastName} has been deactivated!`,
				"success"
			)
		);
	});

export const activateUser = (userId) =>
	catchAsync("user", async (dispatch) => {
		// Reset any previous alerts possibly from error alert
		dispatch(resetAlert());
		// Dispatch loading page
		dispatch({ type: LOADING_USER });
		// Make request to reactivate user
		const res = await axios.patch(`/api/users/activateUser/${userId}`);
		// Dispatch new user details to user list
		dispatch({ type: ACTIVATE_USER, payload: res.data });
		// Dispatch success alert to user
		dispatch(
			setAlert(
				`${res.data.firstName} ${res.data.lastName} has been activated!`,
				"success"
			)
		);
	});

export const changeRole = (userId, isCommittee) =>
	catchAsync("user", async (dispatch) => {
		// Remove and previous alert possible from errors
		dispatch(resetAlert());
		// Dispatch loading page
		dispatch({ type: LOADING_USER });
		if (isCommittee === "true") {
			// Make request to promote non-committee user
			const res = await axios.patch(`/api/users/makeCommittee/${userId}`);
			// Dispatch updated user detail to user list
			dispatch({ type: MAKE_COMMITTEE, payload: res.data });
			// Dispatch alert to user
			dispatch(
				setAlert(
					`${res.data.firstName} ${res.data.lastName} is now a committee member`,
					"success"
				)
			);
		} else {
			// Make request to demote a committee member
			const res = await axios.patch(`/api/users/removeCommittee/${userId}`);
			// Dispatch updated user detail to user list
			dispatch({ type: REMOVE_COMMITTEE, payload: res.data });
			// Dispatch alert to user
			dispatch(
				setAlert(
					`${res.data.firstName} ${res.data.lastName} is back to a normal member`,
					"success"
				)
			);
		}
	});
