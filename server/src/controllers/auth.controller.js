import catchAsync from "../middlewares/catchAsync.js";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import { comparePasswords, generateToken } from "../utils/auth.js";

export const signup = catchAsync(async (req, res, next) => {
  const { username, email, password, role } = req.body;

  // Basic validation
  if (!username || !email || !password) {
    return next(new ApiError(400, "Name, email, and password are required"));
  }

  // Check if user exists (handled by `catchAsync` if `findOne` fails)
  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new ApiError(409, "Email already in use"));
  }

  // Create user (password automatically hashed via `pre('save')` hook)
  const user = await User.create({
    username,
    email,
    password,
    role: role || "Traveler",
  });

  // Never send password back
  const userResponse = {
    _id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };

  res.status(201).json({
    success: true,
    data: userResponse,
    message: "User registered successfully",
  });
});


export const signin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. Check if email and password exist
  if (!email || !password) {
    return next(new ApiError(400, 'Email and password are required'));
  }

  // 2. Find user by email (exclude sensitive fields)
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new ApiError(401, 'Invalid credentials')); // Generic message for security
  }

  // 3. Compare passwords
  const isPasswordValid = await comparePasswords(password, user.password);
  if (!isPasswordValid) {
    return next(new ApiError(401, 'Invalid credentials'));
  }

  // 4. Generate JWT token
  const token = generateToken(user._id);

  // 5. Remove password from response
  user.password = undefined;

  // 6. Send token via HTTP-only cookie (recommended for production)
  res.cookie('token', token, {
    httpOnly: true,
    // secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  // 7. Send response
  res.status(200).json({
    success: true,
    token, // Optional: Also send token in response (if needed for mobile apps)
    data: user,
  });
});



export const google = catchAsync(async (req, res, next) => {
  const { email, name, photo } = req.body;

  // 1. Check if user exists in DB
  let user = await User.findOne({ email });

  if (!user) {
    // 2. If user doesn't exist, create a new one with a random password
    const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8); // Random 16-char password
    // const hashedPassword = await bcrypt.hash(generatedPassword, 12);

    user = await User.create({
      username: name.split(' ').join('').toLowerCase() + Math.random().toString(36).slice(-4), // Unique username
      email,
      password: generatedPassword, // Not needed for Google auth but required by schema
      avatar: photo, // Save Google profile picture
      provider: 'google', // Track auth provider
    });
  }

  // 3. Generate JWT token
  const token = generateToken(user._id);

  // 4. Set HTTP-only cookie
  res.cookie('token', token, {
    httpOnly: true,
    // secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  // 5. Send response (excluding sensitive data)
  const userResponse = {
    _id: user._id,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
    provider: user.provider,
  };

  res.status(200).json({
    success: true,
    token, // Optional: For clients that can't use cookies (e.g., mobile)
    data: userResponse,
  });
});