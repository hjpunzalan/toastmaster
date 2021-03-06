import { combineReducers } from "redux";
import users from "./users";
import auth from "./auth";
import alerts from "./alerts";
import post from "./post";
import textEditor from "./textEditor";
import announcements from "./announcements";

const reducers = combineReducers({
	users,
	announcements,
	post,
	auth,
	alerts,
	textEditor,
});

export default reducers;
