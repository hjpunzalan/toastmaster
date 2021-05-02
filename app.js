// Everything related to express
const express = require("express");
const path = require("path");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const monogoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/userRoutes");
const authRouter = require("./routes/authRoutes");
const postsRouter = require("./routes/postsRoutes");
const uploadRouter = require("./routes/uploadRoutes");
const announcementRouter = require("./routes/announcementRoutes.js");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const authController = require("./controllers/authController");
const userController = require("./controllers/userController");

const app = express();

//////////////////////// Global Middlewares//////////////////////////
app.use(helmet({ contentSecurityPolicy: false,})); // add http headers that secure the server

// Development logging
if (process.env.NODE_ENV !== "production") {
	app.use(morgan("dev"));
}

// Rate limiter that prevents excessive request attacks
const limiter = rateLimit({
	max: 200,
	windowMs: 60 * 60 * 1000,
	message: 'Too many requests from this IP. please try again in an hour!'
});
app.use('/api', limiter);

// Converts incoming json data to js object ---- Body parser that reads data from body into req.body
app.use(express.json({ limit: "30kb" })); // package will parse 10kb into meaningful data
app.use(cookieParser());

// Data sanitization against NoSQL query injection
//Look at the req and filter out all '$' and '.'
app.use(monogoSanitize());

// Data sanitization again XSS ( cross site scripting attacks)
app.use(xss()); // Converts malicious html code into dull code

// Prevent parameter pollution
// prevents adding duplicated parameters in query
app.use(
	hpp({
		whitelist: [], // add http parameters used
	})
);

// Middleware that applies to '/api/' request
// allow access to user during test mode as only logged in admin are able to
if (process.env.NODE_ENV === "test") {
	app.use("/api/test/createuser", userController.createUser);
}
app.use("/api/users", authController.protect, userRouter);
app.use("/api/auth", authRouter);
app.use("/api/announcements", authController.protect, announcementRouter);
app.use("/api/posts", authController.protect, postsRouter); // all posts are protected
app.use("/api/upload", authController.protect, uploadRouter); // all posts are protected

// Handle all unhandled routes
app.all('*', (req, res, next) => {
	const err = new AppError(
		`Can't find ${req.originalUrl} on this server!`,
		404
	);
	next(err); // whatever is passed into next is assumed to be an error
});

app.use(globalErrorHandler);
// Serve static assets in production
if (process.env.NODE_ENV === "production") {
	// set static folder
	app.use(express.static("client/build"));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
	});
}
module.exports = app;
