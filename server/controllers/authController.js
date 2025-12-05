const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

const register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    return next(new Error('Please provide name, email and password'));
  }

  if (password.length < 6) {
    res.status(400);
    return next(new Error('Password must be at least 6 characters'));
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    return next(new Error('User already exists with this email'));
  }

  const user = await User.create({
    name,
    email,
    passwordHash: password,
  });

  const token = user.getSignedJwtToken();

  res.status(201).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
  });
});

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    return next(new Error('Please provide email and password'));
  }

  const user = await User.findOne({ email }).select('+passwordHash');

  if (!user) {
    res.status(401);
    return next(new Error('Invalid credentials'));
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    res.status(401);
    return next(new Error('Invalid credentials'));
  }

  const token = user.getSignedJwtToken();

  res.status(200).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
  });
});

const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
  });
});

module.exports = {
  register,
  login,
  getMe,
};
