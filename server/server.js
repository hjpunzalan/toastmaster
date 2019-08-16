// Things that dont relate to express
const app = require('./app');
const morgan = require('morgan');

// Development logging
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

const port = 3000;
app.listen(port, () => {
	console.log(`App running on port ${port}`);
});
