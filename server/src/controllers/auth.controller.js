import catchAsync from "../middlewares/catchAsync.js";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";

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
