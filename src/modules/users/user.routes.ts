import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validation.middleware.js";
import {
  findMe,
  findUserById,
  findUsers,
  updateUser,
} from "./user.controller.js";
import { updateUserSchema } from "./user.schema.js";

const router = Router();

router.get("/", authenticate, findUsers);
router.get("/me", authenticate, findMe);
router.patch("/update", authenticate, validate(updateUserSchema), updateUser);
router.get("/:id", authenticate, findUserById);

export default router;
