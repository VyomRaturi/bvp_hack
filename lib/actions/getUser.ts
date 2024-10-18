// // src/lib/actions/getUser.ts

// "use server";

// import { verifyToken, AuthPayload } from "@/lib/auth"; // JWT verification utility
// import User from "@/models/User";
// import connectDB from "@/lib/mongodb";
// import { cookies } from "next/headers";

// export const getUserFromServer = async () => {
//   try {
//     await connectDB();

//     // Access cookies using Next.js 'cookies' helper
//     const cookieStore = cookies();
//     const token = cookieStore.get("token")?.value;

//     if (!token) {
//       // No token found, user is not authenticated
//       return null;
//     }

//     // Verify the JWT token
//     const authPayload: AuthPayload | null = verifyToken(token);
//     if (!authPayload) {
//       // Invalid token
//       return null;
//     }

//     // Fetch the user from the database
//     const user = await User.findById(authPayload.userId).select("email role");
//     return user ? { email: user.email, role: user.role } : null;
//   } catch (error) {
//     console.error("Error fetching user:", error);
//     return null;
//   }
// };
