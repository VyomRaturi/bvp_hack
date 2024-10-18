"use server";

import User from "@/models/User";
import connectDB from "@/lib/mongodb";
import bcrypt from "bcrypt";

export const createAdmin = async (email: string, password: string) => {
  console.log(email, password)
  try {
    await connectDB();

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("User already exists");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const newUser = await User.create({
      email,
      password: hashedPassword,
      role: "admin",
    });

    return { message: "Admin created successfully" };
  } catch (error: any) {
    throw new Error(`Error creating admin: ${error.message}`);
  }
};
