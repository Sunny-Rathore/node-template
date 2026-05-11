import { NextFunction, Request, Response } from "express";
import { User } from "../modules/users/user.model.js";

import { AppError } from "../utils/app-error.js";
import { verifyToken } from "../utils/jwt.js";

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new AppError("Not authorized", 401));
    }
    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return next(new AppError("user not found", 404));
    }
    req.user = user;
    next();
  } catch (error) {
    return next(error);
  }
};

export const authorize = (...allowedRoles: Array<"user" | "admin">) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError("Authentication required", 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError("Access denied. Insufficient permissions.", 403),
      );
    }
    next();
  };
};

export const authorizeOwnerOrAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.user) {
    return next(new AppError("Authentication required", 401));
  }

  const userId = req.params.id;
  const isOwner = req.user.id === userId;
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    return next(
      new AppError(
        "Access denied. You can only access your own resources.",
        403,
      ),
    );
  }
  next();
};
