const Task = require('../models/Task');
const User = require('../models/users/User');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const { taskCreateSchema, taskUpdateSchema } = require('../utils/joi/taskValidation');

// Get all tasks with filtering, sorting, and pagination
exports.getAllTasks = catchAsync(async (req, res, next) => {
  const filter = {};
  const query = {};
  const limitFields = {};

  // Filter by status
  if (req.query.status) {
    filter.status = req.query.status;
  }

  // Filter by priority
  if (req.query.priority) {
    filter.priority = req.query.priority;
  }

  // Filter by assignee
  if (req.query.assignee_id) {
    filter.assignee_id = req.query.assignee_id;
  }

  // Filter by current user's assigned tasks if specified
  if (req.query.myTasks === 'true') {
    filter.assignee_id = req.user.id;
  }

  // Text search in title and description
  if (req.query.search) {
    filter.$or = [
      { title: { $regex: req.query.search, $options: 'i' } },
      { description: { $regex: req.query.search, $options: 'i' } }
    ];
  }

  // Sort
  if (req.query.sortBy) {
    const sortBy = req.query.sortBy.split(',').join(' ');
    query.sort = sortBy;
  }

  // Limit fields
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    limitFields.select = fields;
  }

  // Pagination

  const tasks = await Task.find(filter, limitFields.select, query);

  res.status(200).json({
    status: 'success',
    data: {
      tasks
    }
  });
});

// Get single task
exports.getTask = catchAsync(async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return next(new AppError('No task found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      task
    }
  });
});

// Create new task
exports.createTask = catchAsync(async (req, res, next) => {
  // Validate request body
  const { error } = taskCreateSchema.validate(req.body);
  if (error) {
    const fieldErrors = error.details.reduce((acc, err) => {
      acc[err.context.key] = err.message;
      return acc;
    }, {});
    return next(new AppError('Validation failed', 400, fieldErrors));
  }

  // Validate assignee exists
  const assignee = await User.findById(req.body.assignee_id);
  if (!assignee) {
    return next(new AppError('Assignee user not found', 400));
  }

  // Add created_by field
  req.body.created_by = req.user.id;

  const newTask = await Task.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      task: newTask
    }
  });
});

// Update task
exports.updateTask = catchAsync(async (req, res, next) => {
  // Validate request body
  const { error } = taskUpdateSchema.validate(req.body, {
    abortEarly: false,
    allowUnknown: true
  });
  if (error) {
    const fieldErrors = error.details.reduce((acc, err) => {
      acc[err.context.key] = err.message;
      return acc;
    }, {});
    return next(new AppError('Validation failed', 400, fieldErrors));
  }

  // If updating assignee, validate they exist
  if (req.body.assignee_id) {
    const assignee = await User.findById(req.body.assignee_id);
    if (!assignee) {
      return next(new AppError('Assignee user not found', 400));
    }
  }

  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!task) {
    return next(new AppError('No task found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      task
    }
  });
});

// Delete task
exports.deleteTask = catchAsync(async (req, res, next) => {
  const task = await Task.findByIdAndDelete(req.params.id);

  if (!task) {
    return next(new AppError('No task found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Get tasks statistics
exports.getTaskStats = catchAsync(async (req, res, next) => {
  const stats = await Task.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  const priorityStats = await Task.aggregate([
    {
      $group: {
        _id: '$priority',
        count: { $sum: 1 }
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      statusStats: stats,
      priorityStats
    }
  });
});

// Upload attachment to task
exports.uploadTaskAttachment = catchAsync(async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return next(new AppError('No task found with that ID', 404));
  }

  // Expect attachment_url in request body for AWS S3 URLs
  const { attachment_url } = req.body;

  if (!attachment_url) {
    return next(new AppError('Attachment URL is required', 400));
  }

  task.attachment_url = attachment_url;
  await task.save();

  res.status(200).json({
    status: 'success',
    data: {
      task
    }
  });
});
