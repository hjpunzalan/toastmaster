import { createStore, applyMiddleware } from "redux";
import rootReducer from "../reducers";
import { middleware, composeEnhancers } from "../store";

export const storeFactory = (initialState) => {
	return createStore(
		rootReducer,
		initialState,
		composeEnhancers(applyMiddleware(...middleware))
	);
};
