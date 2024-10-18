// // src/lib/auth.ts

import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

// export interface AuthPayload {
//   userId: string;
//   email: string;
//   role: string;
//   iat: number; // Issued At
//   exp: number; // Expiration Time
// }

/**
 * Verifies the JWT token from cookies or headers
 * @param {NextRequest} request - The Next.js request object
 * @returns {AuthPayload | null} - The decoded user information or null if invalid
 */
export const verifyToken = (request: NextRequest): AuthPayload | null => {
  try {
    const cookie = request.headers.get("cookie");
    if (!cookie) return null;

    const token = cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (!token) return null;

    // Verify the token using JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as AuthPayload;

    return decoded;
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
};
