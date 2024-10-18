// src/lib/actions/createOrganizer.ts

"use server";

import User from "@/models/User"; // Your Mongoose User model
import connectDB from "@/lib/mongodb";
// import bcrypt from "bcrypt";

/**
 * Server action to create an organizer user
 * @param {string} email - Organizer's email
 * @param {string} password - Organizer's password
 * @returns {Promise<{ message: string }>} - Success message
 */
export const createOrganizer = async (name: string, email: string, password: string) => {
    try {
        await connectDB();

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error("User with this email already exists");
        }

        // Hash the password before saving
        // const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new organizer
        const newUser = new User({
            name,
            email,
            password: password,
            role: "organizer", // Assign organizer role
        });
        console.log(newUser)

        await newUser.save();

        return { message: "Organizer created successfully" };
    } catch (error: any) {
        throw new Error(`Error creating organizer: ${error.message}`);
    }
};
