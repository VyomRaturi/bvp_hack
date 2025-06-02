import connectDB from "../lib/mongodb";
import mongoose from "mongoose";

async function setupIndexes() {
  try {
    await connectDB();
    const User = mongoose.connection.collection("users");

    // List current indexes
    console.log("Current indexes before updates:");
    const beforeIndexes = await User.listIndexes().toArray();
    console.log(beforeIndexes);

    // Create/Update required indexes
    await User.createIndex(
      { email: 1 },
      {
        unique: true,
        background: true,
        name: "email_1",
      }
    );

    // List indexes after updates
    console.log("\nIndexes after updates:");
    const afterIndexes = await User.listIndexes().toArray();
    console.log(afterIndexes);
  } catch (error) {
    console.error("Error managing indexes:", error);
  } finally {
    await mongoose.disconnect();
  }
}

setupIndexes();
