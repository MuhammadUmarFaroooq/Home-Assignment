require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const { connectDB } = require('./config/connectDb');
const configMiddlewares = require('./config/configMiddlewares');
const routes = require('./config/routes');

const app = express();

// Configure basic middleware
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Configure security and other middlewares
configMiddlewares(app);

// Setup routes
routes(app);

// Connect to database
connectDB();








