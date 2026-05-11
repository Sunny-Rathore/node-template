import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    name: z.string("name is required").min(1, "name is required"),
    email: z.string("email is required").email("invalid email"),
    password: z
      .string("password is required")
      .min(6, "password must be at least 6 characters"),
    profileImage: z.string().optional(),
    verified: z.boolean().default(true),
    role: z.enum(["user", "admin"]).default("user"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string("email is required").email("invalid email"),
    password: z.string("password is required").min(1, "password is required"),
  }),
});
