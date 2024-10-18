// src/lib/actions/testFirebaseAdmin.ts

"use server";

import admin from "@/lib/firebase-admin"; // Ensure correct path

export const testFirebaseAdmin = async () => {
  try {
    const listUsersResult = await admin.auth().listUsers(1);
    console.log("Successfully fetched user data:", listUsersResult);
    return listUsersResult.users.map(user => user.email);
  } catch (error: any) {
    console.error("Firebase Admin SDK Error:", error);
    throw new Error(`Firebase Admin SDK Error: ${error.message}`);
  }
};
