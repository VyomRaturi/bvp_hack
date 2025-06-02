import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const response = NextResponse.json(
    { message: "Logged out successfully" },
    { status: 200 }
  );

  // Clear the auth cookie
  response.cookies.set({
    name: "token",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0, // Expire immediately
  });

  return response;
}
