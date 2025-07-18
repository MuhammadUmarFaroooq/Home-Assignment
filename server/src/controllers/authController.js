const jwt = require('jsonwebtoken');
const crypto = require('node:crypto');
const User = require('../models/users/User');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { removeFields } = require('../utils/helpers');
const { 
  authRegisterSchema, 
  authLoginSchema, 
  forgotPasswordSchema, 
  resetPasswordSchema 
} = require('../utils/joi/authValidation');

const signToken = (user, expires = process.env.JWT_EXPIRES_IN) => jwt.sign({ user }, process.env.JWT_SECRET, {
  expiresIn: expires
});

const createSendToken = (user, statusCode, res) => {
  const userWithRemovedFields = removeFields(user.toJSON(), [
    'password',
    'passwordChangedAt',
    'passwordResetToken',
    'passwordResetExpires',
    'lastLoginAt',
    'createdAt',
    'updatedAt'
  ]);
  const token = signToken(userWithRemovedFields);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: userWithRemovedFields
  });
};

// Register new user
const register = catchAsync(async (req, res, next) => {
  // Validate request body
  const { error } = authRegisterSchema.validate(req.body);
  if (error) {
    const fieldErrors = error.details.reduce((acc, err) => {
      acc[err.context.key] = err.message;
      return acc;
    }, {});
    return next(new AppError('Validation failed', 400, fieldErrors));
  }

  const { email, password, name } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('Email already exists!', 400, { email: 'Email already exists!' }));
  }

  // Create new user
  const newUser = await User.create({
    email,
    password,
    name
  });

  createSendToken(newUser, 201, res);
});

// Login user
const login = catchAsync(async (req, res, next) => {
  // Validate request body
  const { error } = authLoginSchema.validate(req.body);
  if (error) {
    const fieldErrors = error.details.reduce((acc, err) => {
      acc[err.context.key] = err.message;
      return acc;
    }, {});
    return next(new AppError('Validation failed', 400, fieldErrors));
  }

  const { email, password } = req.body;

  // Find user and include password
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new AppError('Invalid credentials', 401));
  }

  // Check if password is correct
  if (!user.password) {
    return next(new AppError('This account uses social login. Please login using Google/Facebook', 401));
  }

  const isPasswordCorrect = await user.comparePasswords(password, user.password);
  if (!isPasswordCorrect) {
    return next(new AppError('Invalid credentials', 401));
  }

  // Update last login
  user.lastLoginAt = Date.now();
  await user.save({ validateBeforeSave: false });

  createSendToken(user, 200, res);
});

// Protect routes middleware
const protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it's there
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  // 2) Verification token
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return next(new AppError('Invalid token. Please log in again!', 401));
  }

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.user.id);
  if (!currentUser) {
    return next(new AppError('The user belonging to this token does no longer exist.', 401));
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('User recently changed password! Please log in again.', 401));
  }

  // Grant access to protected route
  req.user = currentUser;
  next();
});

// Forgot password
const forgotPassword = catchAsync(async (req, res, next) => {
  // Validate request body
  const { error } = forgotPasswordSchema.validate(req.body);
  if (error) {
    const fieldErrors = error.details.reduce((acc, err) => {
      acc[err.context.key] = err.message;
      return acc;
    }, {});
    return next(new AppError('Validation failed', 400, fieldErrors));
  }

  const { email } = req.body;

  // Find user
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Generate reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  try {
    // In a real application, you would send an email here
    res.status(200).json({
      status: 'success',
      message: 'Password reset token sent!',
      resetToken // Remove this in production
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError('There was an error sending the email. Try again later!', 500));
  }
});

// Reset password
const resetPassword = catchAsync(async (req, res, next) => {
  // Validate request body
  const { error } = resetPasswordSchema.validate(req.body);
  if (error) {
    const fieldErrors = error.details.reduce((acc, err) => {
      acc[err.context.key] = err.message;
      return acc;
    }, {});
    return next(new AppError('Validation failed', 400, fieldErrors));
  }

  const { password, token } = req.body;

  // Get user based on the token
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  // If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // Log the user in, send JWT
  createSendToken(user, 200, res);
});

module.exports = {
  register,
  login,
  protect,
  forgotPassword,
  resetPassword
};
