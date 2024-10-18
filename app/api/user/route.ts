// src/app/api/user/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/actions/getCurrentUser";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Exclude sensitive information
    const { password, ...userData } = user;

    return NextResponse.json({ user: userData }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
  }
}
