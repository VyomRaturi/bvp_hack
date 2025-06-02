// src/app/api/auth/login/route.ts

import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User"; // Ensure the path is correct
import connectDB from "@/lib/mongodb"; // Ensure the path is correct
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email, password } = await request.json();
    const normalizedEmail = email.toLowerCase();
    console.log(`Login attempt for email: ${normalizedEmail}`);

    if (!normalizedEmail || !password) {
      console.log("Email or password missing in login request.");
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email: normalizedEmail }).select(
      "+password"
    );
    if (!user) {
      console.log(`No user found with email: ${normalizedEmail}`);
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log(`Password match for email ${normalizedEmail}: ${isMatch}`);

    if (!isMatch) {
      console.log(`Invalid password for email: ${normalizedEmail}`);
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );
    console.log("Generated token:", token);

    const response = NextResponse.json(
      {
        message: "Login successful.",
        user: {
          role: user.role,
          email: user.email,
          id: user._id,
        },
      },
      { status: 200 }
    );

    // Set the token cookie
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax", // Changed from 'strict' to 'lax' for better compatibility
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    console.log("Token cookie set in response");

    return response;
  } catch (error: any) {
    console.error(`Login Error: ${error.message}`);
    return NextResponse.json(
      { message: "Internal Server Error." },
      { status: 500 }
    );
  }
}
