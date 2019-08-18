// Things that dont relate to express
const app = require('./app');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// SYNC
// listening to event uncaughtException
process.on('uncaughtException', err => {
	console.log('UNCAUGHT Exception! Shutting down...');
	console.log(err.name, err.message);
	process.exit(1); // 0 success , 1 for unhanled rejection
});
//////////////

dotenv.config({ path: './config.env' });

// Connecting to mongoDB using mongoose
const DB = process.env.DATABASE.replace(
	'<PASSWORD>',
	process.env.DATABASE_PASSWORD
);
mongoose
	.connect(DB, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false
	})
	.then(() => console.log('DB connection is successful'));

console.log(`Server running on: ${process.env.NODE_ENV} mode`);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
	console.log(`App running on port ${port}`);
});

// ASYNC Promises
// process object will emmitt unhandled rejection
// promise rejection to have last safety nets
process.on('unhandledRejection', err => {
	console.log('UNHANDLED REJECTION! Shutting down...');
	console.log(err.name, err.message);
	server.close(() => {
		//  BY having server.close finishes all request that is being handled then closes the app
		process.exit(1); // 0 success , 1 for unhanled rejection
	});
});

// Need a tool that restarts application
