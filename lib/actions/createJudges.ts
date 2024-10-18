// src/lib/actions/createJudges.ts

"use server";

import User from "@/models/User"; // Your Mongoose User model
import connectDB from "@/lib/mongodb"; // Your MongoDB connection utility
// import bcrypt from "bcrypt";
import { randomBytes } from "crypto"; // For secure password generation

interface JudgeInput {
  name: string;
  email: string;
}

interface JudgeOutput {
  name: string;
  email: string;
  password: string;
}

/**
 * Generates a secure random password
 * @param length Number of characters in the password
 * @returns A randomly generated password string
 */
const generatePassword = (length: number = 12): string => {
  return randomBytes(length)
    .toString("base64") // Convert to Base64 to get a wide range of characters
    .slice(0, length) // Trim to desired length
    .replace(/\+/g, "0") // Replace '+' with '0' to avoid URL encoding issues
    .replace(/\//g, "0"); // Replace '/' with '0'
};

/**
 * Server action to create multiple judges
 * @param judges Array of judge objects containing name and email
 * @returns Array of judge objects with name, email, and plain password
 */
export const createJudges = async (judges: JudgeInput[]): Promise<JudgeOutput[]> => {
  try {
    await connectDB();

    const createdJudges: JudgeOutput[] = [];

    for (const judge of judges) {
      const { name, email } = judge;

      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error(`User with email ${email} already exists.`);
      }

      // Generate a secure random password
      const plainPassword = generatePassword(12);

      // Hash the password before storing
    //   const hashedPassword = await bcrypt.hash(plainPassword, 10);

      // Create the judge user
      const newUser = new User({
        name,
        email,
        password: plainPassword,
        role: "judge",
      });

      await newUser.save();

      // Push the created judge's info to the response array
      createdJudges.push({
        name,
        email,
        password: plainPassword,
      });
    }

    return createdJudges;
  } catch (error: any) {
    console.error("Error creating judges:", error);
    throw new Error(`Failed to create judges: ${error.message}`);
  }
};
