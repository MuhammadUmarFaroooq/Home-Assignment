const express = require('express');
const taskController = require('../controllers/taskController');
const authController = require('../controllers/authController');


const router = express.Router();

// Protect all task routes
router.use(authController.protect);

// Task statistics
router.get('/stats', taskController.getTaskStats);

// Task routes
router
  .route('/')
  .get(taskController.getAllTasks)
  .post(taskController.createTask);

router
  .route('/:id')
  .get(taskController.getTask)
  .patch(taskController.updateTask)
  .delete(taskController.deleteTask);

// Upload attachment to task  
router.post('/:id/upload', taskController.uploadTaskAttachment);

module.exports = router;
