// Everything related to express
const express = require('express');
const morgan = require('morgan');
const userRouter = require('./routes/userRoutes');
const postsRouter = require('./routes/postsRoutes');

const app = express();

// Init Middleware
// Development logging
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}
// Converts incoming json data to js object ---- Body parser that reads data from body into req.body
app.use(express.json({ limit: '10kb' })); // package will parse 10kb into meaningful data

// Middleware that applies to '/api/' request
app.use('/api/users', userRouter);
app.use('/api/posts', postsRouter);

module.exports = app;
