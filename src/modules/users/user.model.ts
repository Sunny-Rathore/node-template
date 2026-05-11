import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: false, unique: true },
    password: { type: String, required: true, select: false },
    profileImage: { type: String, required: false },
    verified: { type: Boolean, default: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true },
);

userSchema.pre("save", async function (this: any, next: any) {
  if (!this.isModified("password")) return next();
  this.password = await (bcrypt as any).hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (password: string) {
  return await (bcrypt as any).compare(password, this.password);
};

export const User = mongoose.model("User", userSchema);
