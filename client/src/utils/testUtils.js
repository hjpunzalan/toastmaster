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

export const findByTestAttr = (wrapper, val) => {
	// Find custom attribute data-test
	return wrapper.find(`[data-test="${val}"]`);
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
