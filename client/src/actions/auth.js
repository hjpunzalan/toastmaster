import axios from "axios";
import {
	LOGIN_SUCCESS,
	CLEAR_LOGIN,
	LOGOUT,
	AUTH_ERROR,
	FORGOT_PASSWORD,
	LOADING_AUTH,
	RESET_PASSWORD,
	CHANGE_PASSWORD,
} from "../actions/types";
import catchAsync from "../utils/catchAsync";
import { resetAlert, setAlert } from "./alerts";

export const loginUser = (formData, history) =>
	catchAsync("auth", async (dispatch) => {
		// Need to be in every post/put/patch action with alert
		// If request fails there may be an alert for the error
		dispatch(resetAlert());
		// ENSURE auth is empty and change loading state to true
		dispatch({ type: CLEAR_LOGIN });
		// Send login form
		const res = await axios.post("/api/auth/login", formData);
		// Dispatch login action authenticating user
		// Change login state to false
		dispatch({
			type: LOGIN_SUCCESS,
			payload: res.data,
		});
		// Navigate user to dashboard
		history.push("/dashboard");
	});

export const checkUser = () => async (dispatch) => {
	try {
		// Check if user is logged in at the start of the app
		const res = await axios.get("/api/auth/checkUser");
		// Log user in if user has a JWT cookie from browser client
		const user = res.data;
		dispatch({
			type: LOGIN_SUCCESS,
			payload: user,
		});
	} catch (error) {
		// If not logged in, dispatch authenticate error action
		dispatch({ type: AUTH_ERROR });
	}
};

export const logoutUser = () =>
	catchAsync("auth", async (dispatch) => {
		// ENSURE auth is empty and change loading state to true
		dispatch({ type: CLEAR_LOGIN });
		// Make request to logout user
		await axios.get("/api/auth/logout");
		// Dispatch logout action and change loading state to false
		dispatch({ type: LOGOUT });
	});

export const forgotPassword = (email, url) =>
	catchAsync("auth", async (dispatch) => {
		// Reset any previous alert that may be set
		dispatch(resetAlert());
		// Change loading state to true
		dispatch({ type: LOADING_AUTH });
		// Send info to server that will send email.
		await axios.post("/api/auth/forgotPassword", { email, url });
		// Change loading state to false due to forgot password
		dispatch({ type: FORGOT_PASSWORD });
		// Dispatch alert to user
		dispatch(
			setAlert(
				"Success! Please check your email to reset your password.",
				"success"
			)
		);
	});

export const resetPassword = ({ password, resetToken, history }) =>
	catchAsync("auth", async (dispatch) => {
		// Clear any previous alert that may be set
		dispatch(resetAlert());
		// Change loading state to true
		dispatch({ type: LOADING_AUTH });
		// Send info to server that will send email.
		const res = await axios.patch(`/api/auth/resetPassword/${resetToken}`, {
			password,
		});
		// Authenticate user details and change loading state to false
		dispatch({ type: RESET_PASSWORD, payload: res.data });
		// Navigate user to dashboard
		history.push("/dashboard");
		// Send alert to user
		dispatch(setAlert("Success! New passsword has been set.", "success"));
	});

export const changePassword = (
	{ currentPassword: password, newPassword },
	history
) =>
	catchAsync("update", async (dispatch) => {
		// Clear any previous alert
		dispatch(resetAlert());
		// Change loading state to true
		dispatch({ type: LOADING_AUTH });
		// Send info to server that will send email.
		const res = await axios.post(
			`/api/users/updatePassword`,
			{ password, newPassword },
			{
				headers: {
					"Content-type": "application/json",
				},
			}
		);
		// Change loading state to false
		dispatch({ type: CHANGE_PASSWORD, payload: res.data });
		// Navigate user back to dashboard
		history.push("/dashboard");
		// Send alert to user
		dispatch(setAlert("Success! Password changed.", "success"));
	});
