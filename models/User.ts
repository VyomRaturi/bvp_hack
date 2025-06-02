// src/models/User.ts

import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcrypt";

export type UserRole = "admin" | "user" | "organizer" | "judge";

export interface IUser extends Document {
  email: string;
  password: string;
  name?: string;
  role: UserRole;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [1, "Password must be at least 1 character long"],
      select: false, // Exclude password from query results by default
    },
    name: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: ["admin", "user", "organizer", "judge"],
      default: "user",
    },
  },
  { timestamps: true }
);

/**
 * Hash the password before saving
 */
UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();

  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

/**
 * Compare candidate password with stored hash
 */
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Prevent OverwriteModelError during hot-reloading
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
