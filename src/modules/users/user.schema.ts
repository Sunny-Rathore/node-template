import z from "zod";
import { registerSchema } from "../auth/auth.schema.js";

export const updateUserSchema = z.object({
  body: registerSchema.shape.body
    .omit({
      email: true,
      role: true,
      password: true,
    })
    .partial(),
});
