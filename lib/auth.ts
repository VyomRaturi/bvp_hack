// src/lib/auth.ts

import jwt from "jsonwebtoken";

export interface AuthPayload {
  userId: string;
  email: string;
  role: string;
  iat: number; // Issued At
  exp: number; // Expiration Time
}

/**
 * Verifies the JWT token
 * @param {string} token - The JWT token
 * @returns {AuthPayload | null} - The decoded user information or null if invalid
 */
export const verifyToken = (token: string): AuthPayload | null => {
  try {
    // Verify the token using JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as AuthPayload;
    return decoded;
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
};
