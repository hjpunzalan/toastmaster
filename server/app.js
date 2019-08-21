// Everything related to express
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const userRouter = require('./routes/userRoutes');
const authRouter = require('./routes/authRoutes');
const postsRouter = require('./routes/postsRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const authController = require('./controllers/authController');

const app = express();

//////////////////////// Global Middlewares//////////////////////////
app.use(helmet()); // add http headers that secure the server

// Development logging
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

// Rate limiter that prevents excessive request attacks
const limiter = rateLimit({
	max: 100,
	windowMs: 60 * 60 * 1000,
	message: 'Too many requests from this IP. please try again in an hour!'
});
app.use('/api', limiter);

// Converts incoming json data to js object ---- Body parser that reads data from body into req.body
app.use(express.json({ limit: '10kb' })); // package will parse 10kb into meaningful data

// Data sanitization against NoSQL query injection
//Look at the req and filter out all '$' and '.'
app.use(monogoSanitize());

// Data sanitization again XSS ( cross site scripting attacks)
app.use(xss()); // Converts malicious html code into dull code

// Prevent parameter pollution
app.use(
	hpp({
		whitelist: [] // add http parameters used
	})
);

// Middleware that applies to '/api/' request
app.use('/api/users', authController.protect, userRouter); // all users are protected
app.use('/api/auth', authRouter);
app.use('/api/posts', authController.protect, postsRouter); // all posts are protected

// Handle all unhandled routes
app.all('*', (req, res, next) => {
	const err = new AppError(
		`Can't find ${req.originalUrl} on this server!`,
		404
	);
	next(err); // whatever is passed into next is assumed to be an error
});

app.use(globalErrorHandler);

module.exports = app;
