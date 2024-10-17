import mongoose, { Document, Model, Schema } from "mongoose";

interface IUser extends Document {
  email: string;
  password: string;
  role: string;
}

const userSchema: Schema<IUser> = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: "user" },
});

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
