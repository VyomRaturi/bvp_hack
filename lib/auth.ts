// // src/lib/auth.ts

import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import Cookie from "js-cookie";

export interface AuthPayload {
  userId: string;
  role: string;
  iat?: number;
  exp?: number;
}

// For server-side (API routes and middleware)
const SERVER_JWT_SECRET = process.env.JWT_SECRET;
// For client-side
const CLIENT_JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET;

// Use the appropriate secret based on the environment
const JWT_SECRET =
  typeof window === "undefined" ? SERVER_JWT_SECRET : CLIENT_JWT_SECRET;

if (!JWT_SECRET) {
  console.error("JWT_SECRET is not defined in environment variables");
  // Don't throw error in client-side to prevent app from crashing
  if (typeof window === "undefined") {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
}

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

    // Verify the token using SERVER_JWT_SECRET
    const decoded = jwt.verify(token, SERVER_JWT_SECRET || "") as AuthPayload;

    // Check if token is expired
    if (decoded.exp && decoded.exp < Date.now() / 1000) {
      return null;
    }

    return decoded;
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
};

/**
 * Checks if the user is authenticated on the client side
 * @returns {Promise<boolean>} - Whether the user is authenticated
 */
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const response = await fetch("/api/user", {
      credentials: "include",
    });
    return response.ok;
  } catch (error) {
    console.error("Auth check error:", error);
    return false;
  }
};

/**
 * Gets the current user's role from the token
 * @returns {string | null} - The user's role or null if not authenticated
 */
export const getUserRole = (): string | null => {
  const token = Cookie.get("token");
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, CLIENT_JWT_SECRET || "") as AuthPayload;
    return decoded.role;
  } catch (err) {
    return null;
  }
};
