// Everything related to express
const express = require('express');
const userRouter = require('./routes/userRoutes');

const app = express();

// Init Middleware
// Converts incoming json data to js object ---- Body parser that reads data from body into req.body
app.use(express.json({ limit: '10kb' })); // package will parse 10kb into meaningful data

// Middleware that applies to '/api/' request
app.use('/api/users', userRouter);

module.exports = app;
