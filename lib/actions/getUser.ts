"use server";

import { verifyToken } from "@/lib/auth"; // Utility to verify JWT
import User from "@/models/User";
import connectDB from "@/lib/mongodb";
import { NextRequest } from "next/server";

export const getUserFromServer = async () => {
  try {
    await connectDB();

    // Get the token from the cookies
    const headers = new Headers();
    headers.append('cookie', document.cookie || '');
    
    const mockRequest = new Request('http://localhost', {
      headers,
    });

    const authPayload = verifyToken(mockRequest as NextRequest);
    if (!authPayload) {
      return null;
    }

    const user = await User.findById(authPayload.userId).select("email role");
    return user ? { email: user.email, role: user.role } : null;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};
