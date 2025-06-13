import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import connectDB from "@/lib/mongodb";
import bcrypt from "bcrypt";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email } = await request.json();
    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // Find the judge
    const judge = await User.findOne({
      email: email.toLowerCase(),
      role: "judge",
    });
    if (!judge) {
      return NextResponse.json({ message: "Judge not found" }, { status: 404 });
    }

    // Generate a new random password
    const newPassword = crypto
      .randomBytes(8)
      .toString("base64")
      .slice(0, 8)
      .replace(/\+/g, "0")
      .replace(/\//g, "1")
      .replace(/=/g, "2");

    // Update the judge's password
    judge.password = newPassword;
    await judge.save();

    return NextResponse.json({
      message: "Password reset successful",
      email: judge.email,
      newPassword: newPassword,
    });
  } catch (error: any) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { message: "Error resetting password" },
      { status: 500 }
    );
  }
}
