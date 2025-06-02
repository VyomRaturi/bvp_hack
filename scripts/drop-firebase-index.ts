import connectDB from "../lib/mongodb";
import mongoose from "mongoose";

async function dropFirebaseIndex() {
  try {
    await connectDB();
    const User = mongoose.connection.collection("users");
    await User.dropIndex("firebaseUid_1");
    console.log("Successfully dropped firebaseUid index");
  } catch (error) {
    if (error.message.includes("index not found")) {
      console.log("Index does not exist - nothing to drop");
    } else {
      console.error("Error dropping index:", error);
    }
  } finally {
    await mongoose.disconnect();
  }
}

dropFirebaseIndex();
