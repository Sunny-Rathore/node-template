import { Request, Response } from "express";
import { generateToken } from "../../utils/jwt.js";

import { AuthRequest } from "../../middlewares/auth.middleware.js";
import { AppError } from "../../utils/app-error.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { sendResponse } from "../../utils/response.js";
import { User } from "../users/user.model.js";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new AppError("User already exists", 400);
  }

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id.toString());

  sendResponse(res, 201, "User registered successfully", {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    token,
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user: any = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new AppError("Invalid credentials", 400);
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new AppError("Invalid credentials", 400);
  }

  const token = generateToken(user._id.toString());

  return sendResponse(res, 200, "Login successful", {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  });
});

export const changePassword = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const user: any = await User.findById(req.user.id).select("+password");
    if (!user) {
      throw new AppError("user not found", 401);
    }
    const isMatch = await user.comparePassword(req.body.currentPassword);
    if (!isMatch) {
      return new AppError("Current password is incorrect", 400);
    }
    user.password = req.body.newPassword;
    user.save();
    sendResponse(res, 200, "Password changed successfully");
  },
);
