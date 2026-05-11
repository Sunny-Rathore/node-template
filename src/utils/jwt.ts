import jwt, { SignOptions } from "jsonwebtoken";

import { env } from "../config/env.js";
import { AppError } from "./app-error.js";
export const generateToken = (userId: string): string => {
  return jwt.sign({ id: userId }, env.jwtSecret as string, {
    expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"],
  });
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, env.jwtSecret);
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      throw new Error("Token expired");
    }
    if (error.name === "JsonWebTokenError") {
      throw new Error("Invalid token");
    }
    throw new AppError(error, 500);
  }
};
