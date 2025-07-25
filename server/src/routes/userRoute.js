const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

// Protect all user routes
router.use(authController.protect);

// User profile routes
router.get('/me', userController.getMe);
router.patch('/me', userController.updateMe);

// User search route for task assignment
router.get('/search', userController.searchUsers);

// All users route
router.get('/', userController.getAllUsers);

// Single user route
router.get('/:id', userController.getUser);

module.exports = router;

