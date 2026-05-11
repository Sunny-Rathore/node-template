import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { logger } from "../../config/logger.js";
import { AuthRequest } from "../../middlewares/auth.middleware.js";
import { AppError } from "../../utils/app-error.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { sendResponse } from "../../utils/response.js";
import { User } from "./user.model.js";

export const findUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await User.find();
  return sendResponse(res, 200, "Users Fetched Successfully", users);
});

export const findUserById = asyncHandler(
  async (req: Request, res: Response) => {
    const isValid: boolean = isValidObjectId(req.params.id);
    if (!isValid) throw new AppError("Invalid id", 400);
    const user = await User.findById(req.params.id);
    if (!user) throw new AppError("User not found", 404);
    return sendResponse(res, 200, "User Fetched Successfully", user);
  },
);

export const findMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const user = await User.findById(userId);
  return sendResponse(res, 200, "User Fetched Successfully", user);
});

export const updateUser = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    logger.info(userId);
    logger.info(req.body);
    const user = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
      runValidators: true,
    });
    return sendResponse(res, 200, "User updated successfully", user);
  },
);
