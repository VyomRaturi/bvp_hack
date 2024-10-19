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
  // const token = req.cookies.get("token")?.value; // Assuming the JWT is stored in a 'token' cookie
  // console.log ("token is", token)
  // if (!token) {
  //   return null;
  // }

  try {

    // const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    console.log("connecting db");
    await connectDB();
    console.log("cehcking for user now");
    // const user = await User.findById(decoded.userId).lean();
    const user = await User.findById("6712d8f46e4c3cf0d30a14e4").lean();
    console.log(user);
    return user;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}
