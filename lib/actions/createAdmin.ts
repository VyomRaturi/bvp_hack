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

    console.log(password)
    // const hashedPassword = await bcrypt.hash(password, 10);
    // // const hashedPassword = await bcrypt.hash(password, 10);
    // console.log(`Hashed password for admin ${email}: ${hashedPassword}`);

    // Create admin user
    const newUser = await User.create({
      email,
      password: password,
      role: "admin",
    });

    return { message: "Admin created successfully" };
  } catch (error: any) {
    throw new Error(`Error creating admin: ${error.message}`);
  }
};
