import { CompositeDecorator } from "draft-js";

const getPluginDecoratorArray = (listOfPlugins) => {
	let decorators = [];
	let plugin;
	// check each plugin that will be used in the editor for decorators
	// (retrieve listOfPlugins however makes sense in your code)
	for (plugin of listOfPlugins) {
		if (plugin.decorators !== null && plugin.decorators !== undefined) {
			// if the plugin has any decorators, add them to a list of all decorators from all plugins
			decorators = decorators.concat(plugin.decorators);
		}
	}
	return decorators;
};

const pluginDecorator = (listOfPlugins) => {
	// I can't quite remember why I had to wrap things in this exact way, but found that I ran into
	// errors if I did not both have a MultiDecorator and a CompositeDecorator wrapping
	return new CompositeDecorator(getPluginDecoratorArray(listOfPlugins))
	
};

export default pluginDecorator;
