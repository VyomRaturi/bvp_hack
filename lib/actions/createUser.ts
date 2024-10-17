// lib/actions/createUser.ts
"use server";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { toast } from "@/components/ui/use-toast";
import User from "@/models/User";
import connectDB from "../mongodb"; // Ensure you have the MongoDB connection file

export const createUser = async (
  auth: any,
  email: string,
  password: string,
  role: string
) => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    toast({
      title: "Success!",
      description: "You have been signed up.",
    });

    // Connect to MongoDB
    await connectDB();

    // Save user to MongoDB
    const user = new User({ email, password, role });
    await user.save();
  } catch (error) {
    toast({ title: "Error Signing Up", description: `${error}` });
  }

  return;
};
