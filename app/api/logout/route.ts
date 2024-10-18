// src/app/api/logout/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const response = NextResponse.json(
    { message: "Logged out successfully." },
    { status: 200 }
  );

  // Clear the 'token' cookie by setting it to expire in the past
  response.cookies.set("token", "", {
    path: "/", // Ensure the path matches where the cookie was set
    expires: new Date(0), // Expire the cookie immediately
    httpOnly: true, // Secure the cookie from client-side scripts
    sameSite: "lax", // Adjust based on your security needs
  });

  return response;
}
