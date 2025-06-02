import connectDB from "../lib/mongodb";
import mongoose from "mongoose";

async function listIndexes() {
  try {
    await connectDB();
    const User = mongoose.connection.collection("users");
    const indexes = await User.listIndexes().toArray();
    console.log(
      "Current indexes on users collection:",
      JSON.stringify(indexes, null, 2)
    );
  } catch (error) {
    console.error("Error listing indexes:", error);
  } finally {
    await mongoose.disconnect();
  }
}

listIndexes();
