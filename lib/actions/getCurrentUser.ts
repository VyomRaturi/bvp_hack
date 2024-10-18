// src/lib/getCurrentUser.ts

import { NextRequest } from "next/server";
import User from "@/models/User";
import connectDB from "@/lib/mongodb";
import jwt from "jsonwebtoken";

interface DecodedToken {
  userId: string;
}

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function getCurrentUser(req: NextRequest) {
  const token = req.cookies.get("token")?.value; // Assuming the JWT is stored in a 'token' cookie

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    await connectDB();
    const user = await User.findById(decoded.userId).lean();
    return user;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}
