// Create react app already set this file to run before each test
import Enzyme from "enzyme";
import EnzymeAdapter from "enzyme-adapter-react-16";

Enzyme.configure({
	adapter: new EnzymeAdapter(),
	disableLifecycleMethods: true, // only run when declared
});
