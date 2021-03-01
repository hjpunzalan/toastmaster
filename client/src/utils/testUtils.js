import { createStore, applyMiddleware } from "redux";
import checkPropTypes from "check-prop-types";
import rootReducer from "../reducers";
import { middleware, composeEnhancers } from "../store";

const initialState = {};

export const storeFactory = (initialState) => {
	return createStore(
		rootReducer,
		initialState,
		composeEnhancers(applyMiddleware(...middleware))
	);
};

export const checkProps = (component, conformingProps) => {
	const propError = checkPropTypes(
		component.propTypes,
		conformingProps,
		"prop",
		component.name
	);
	expect(propError).toBeUndefined();
};
