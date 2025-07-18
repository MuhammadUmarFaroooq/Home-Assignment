const express = require('express');
const authRoute = require('../routes/authRoute');
const userRoute = require('../routes/userRoute');
const taskRoute = require('../routes/taskRoute');
const uploadRoute = require('../routes/uploadRoute');

const otherRoutes = require('./otherRoutes');

module.exports = (app) => {
  app.use(express.json({ limit: '30mb' }));
  app.use('/api/auth', authRoute);
  app.use('/api/users', userRoute);
  app.use('/api/tasks', taskRoute);
  app.use('/api/upload', uploadRoute);
  otherRoutes(app);
};
