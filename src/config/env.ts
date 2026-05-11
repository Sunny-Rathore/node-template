import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: process.env.PORT || 5001,
  mongodbUri:
    process.env.MONGODB_URI ||
    "mongodb+srv://db_user_node_ts:node123@cluster0.m7ojqgr.mongodb.net/?appName=Cluster0",
  nodeEnv: process.env.NODE_ENV || "development",
  jwtSecret: process.env.JWT_SECRET || "secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
  logLevel: process.env.LOG_LEVEL || "info",
};
