// src/lib/getCurrentUser.ts

import { NextRequest } from "next/server";
import User from "@/models/User";
import connectDB from "@/lib/mongodb";
import jwt from "jsonwebtoken";

interface DecodedToken {
  userId: string;
  role: string;
}

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET must be defined in environment variables");
}

export async function getCurrentUser(req: NextRequest) {
  try {
    // Get token from cookies
    const token = req.cookies.get("token")?.value;

    if (!token) {
      console.log("No token found in cookies");
      return null;
    }

    // Verify and decode the token
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;

    // Connect to database
    await connectDB();

    // Find user by ID and exclude password
    const user = await User.findById(decoded.userId).select("-password").lean();

    if (!user) {
      console.log("No user found for token");
      return null;
    }

    return user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}
