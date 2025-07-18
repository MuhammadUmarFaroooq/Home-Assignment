const mongoose = require('mongoose');
const User = require('../models/users/User');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Get all users with search functionality
const getAllUsers = catchAsync(async (req, res, next) => {
  // Build filter object
  const query = {};

  // Text search in name and email
  if (req.query.q) {
    query.$or = [{ name: { $regex: req.query.q, $options: 'i' } }];
  }

  const users = await User.find(query).select(
    '-password -passwordResetToken -passwordResetExpires'
  );

  res.status(200).json({
    status: 'success',
    data: {
      users
    }
  });
});

// Search users specifically for task assignment
const searchUsers = catchAsync(async (req, res, next) => {
  const { q } = req.query;

  if (!q) {
    return next(new AppError('Search query is required', 400));
  }

  const users = await User.find({
    $or: [{ name: { $regex: q, $options: 'i' } }, { email: { $regex: q, $options: 'i' } }]
  })
    .select('name email')
    .limit(10);

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  });
});

// Get single user
const getUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError('Invalid ID', 400));
  }

  const user = await User.findById(id).select(
    '-password -passwordResetToken -passwordResetExpires'
  );

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

// Get current user profile
const getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select(
    '-password -passwordResetToken -passwordResetExpires'
  );

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

// Update current user profile
const updateMe = catchAsync(async (req, res, next) => {
  // Don't allow password update through this route
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError('This route is not for password updates. Please use /updatePassword.', 400)
    );
  }

  // Filter out unwanted fields
  const allowedFields = ['name', 'email'];
  const filteredBody = {};

  Object.keys(req.body).forEach((el) => {
    if (allowedFields.includes(el)) {
      filteredBody[el] = req.body[el];
    }
  });

  // Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  }).select('-password -passwordResetToken -passwordResetExpires');

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

module.exports = {
  getAllUsers,
  searchUsers,
  getUser,
  getMe,
  updateMe
};
