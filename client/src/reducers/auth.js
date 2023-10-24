import { faker } from "@faker-js/faker";
import {
  AUTH_ERROR,
  CHANGE_PASSWORD,
  CLEAR_LOGIN,
  FORGOT_PASSWORD,
  LOADING_AUTH,
  LOGIN_SUCCESS,
  LOGOUT,
  RESET_PASSWORD,
  UPDATE_FAILED,
  UPDATE_ME,
} from "../actions/types";

export const initialState = {
  currentUser: null,
  isAuthenticated: false,
  loading: true,
  isModified: false,
};

const authReducer = (state = initialState, action) => {
  const { type, payload } = action;
  if (payload && !payload.photo) {
    payload.photo = faker.image.avatar();
  }

  switch (type) {
    case LOADING_AUTH:
      return { ...state, loading: true };
    case CLEAR_LOGIN:
      return {
        ...state,
        currentUser: null,
        isAuthenticated: false,
        loading: true,
      };
    case LOGIN_SUCCESS:
    case RESET_PASSWORD:
    case CHANGE_PASSWORD:
      return {
        //State needs to be first
        ...state,
        currentUser: payload,
        isAuthenticated: true,
        loading: false,
      };
    case FORGOT_PASSWORD:
    case LOGOUT:
    case AUTH_ERROR:
      return {
        ...state,
        loading: false,
      };

    case UPDATE_ME:
      return {
        ...state,
        loading: false,
        currentUser: payload,
        isModified: true,
      };
    case UPDATE_FAILED:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
};

export default authReducer;
