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
		dispatch(resetAlert());
		dispatch({ type: LOADING_USER });
		const res = await axios.post(
			"/api/users/register",
			{ ...formData, url },
			{
				headers: {
					"Content-type": "application/json",
				},
			}
		);
		dispatch({ type: REGISTER_SUCCESS, payload: res.data });
		dispatch(
			setAlert(
				`${formData.firstName} ${formData.lastName} was successfully registered and temporary password sent to user's email`,
				"success"
			)
		);
	});

export const updateMe = (formData, file, history) =>
	catchAsync("update", async (dispatch) => {
		dispatch(resetAlert());
		dispatch({ type: LOADING_AUTH });

		if (file) {
			// Send file
			const uploadConfig = await axios.post("/api/upload", { type: file.type });

			await axios.put(uploadConfig.data.url, file, {
				headers: {
					"Content-Type": file.type,
				},
			});
			// Set photo link
			formData.photo = `https://toastmaster-user-photo.s3-ap-southeast-2.amazonaws.com/${uploadConfig.data.key}`;
		}
		const res = await axios.patch("/api/users/updateMe", formData, {
			headers: {
				"Content-Type": "application/json",
			},
		});

		history.push("/dashboard");
		dispatch({
			type: UPDATE_ME,
			payload: res.data,
		});
		dispatch(setAlert("User updated", "success"));
	});

export const getAllUsers = () =>
	catchAsync(async (dispatch) => {
		const res = await axios.get(`/api/users?sort=firstName`);

		dispatch({
			type: GET_ALL_USERS,
			payload: res.data,
		});
	});

export const toggleView = () => (dispatch) =>
	dispatch({ type: TOGGLE_MODERATOR });

export const deActivateUser = (userId) =>
	catchAsync("user", async (dispatch) => {
		dispatch(resetAlert());
		dispatch({ type: LOADING_USER });
		const res = await axios.patch(`/api/users/deActivateUser/${userId}`);

		dispatch({ type: DEACTIVATE_USER, payload: res.data });
		dispatch(
			setAlert(
				`${res.data.firstName} ${res.data.lastName} has been deactivated!`,
				"success"
			)
		);
	});

export const activateUser = (userId) =>
	catchAsync("user", async (dispatch) => {
		dispatch(resetAlert());
		dispatch({ type: LOADING_USER });
		const res = await axios.patch(`/api/users/activateUser/${userId}`);

		dispatch({ type: ACTIVATE_USER, payload: res.data });
		dispatch(
			setAlert(
				`${res.data.firstName} ${res.data.lastName} has been activated!`,
				"success"
			)
		);
	});

export const changeRole = (userId, isCommittee) =>
	catchAsync("user", async (dispatch) => {
		dispatch(resetAlert());
		dispatch({ type: LOADING_USER });
		if (isCommittee === "true") {
			const res = await axios.patch(`/api/users/makeCommittee/${userId}`);
			dispatch({ type: MAKE_COMMITTEE, payload: res.data });
			dispatch(
				setAlert(
					`${res.data.firstName} ${res.data.lastName} is now a committee member`,
					"success"
				)
			);
		} else {
			const res = await axios.patch(`/api/users/removeCommittee/${userId}`);
			dispatch({ type: REMOVE_COMMITTEE, payload: res.data });
			dispatch(
				setAlert(
					`${res.data.firstName} ${res.data.lastName} is back to a normal member`,
					"success"
				)
			);
		}
	});
