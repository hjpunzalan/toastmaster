// Create react app already set this file to run before each test
import Enzyme from "enzyme";
import EnzymeAdapter from "enzyme-adapter-react-16";
import enableHooks from 'jest-react-hooks-shallow';

// jest-react-hooks-shallow
// pass an instance of jest to `enableHooks()`
// This package makes React Hooks (namely, useEffect() and useLayoutEffect()) work with shallow rendering. 
// In other words, you can use enzyme.
enableHooks(jest);

Enzyme.configure({
	adapter: new EnzymeAdapter(),
	disableLifecycleMethods: true, // only run when declared
});
