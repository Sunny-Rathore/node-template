import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { errorMiddleware } from "./middlewares/error.middleware.js";

import authRouter from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/users/user.routes.js";
const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use("/api/", limiter);

// Routes
app.use("/api/auth", authRouter);
app.use("/api/users", userRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Node API is running...");
});

// Error handling
app.use(errorMiddleware);

export default app;
