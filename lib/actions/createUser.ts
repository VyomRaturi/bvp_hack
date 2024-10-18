"use server";

import User from "@/models/User";
import connectDB from "../mongodb";

export const createUser = async (
  email: string,
  password: string,
  role: string
) => {
  try {
    await connectDB();

    const user = new User({ email, password, role });
    await user.save();
  } catch (error) {
    throw new Error(`${error}`);
  }
};
