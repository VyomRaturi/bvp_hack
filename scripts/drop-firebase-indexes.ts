import connectDB from "../lib/mongodb";
import mongoose from "mongoose";

async function dropFirebaseIndexes() {
  try {
    await connectDB();
    const User = mongoose.connection.collection("users");

    // Get all indexes on the users collection
    const indexes = await User.listIndexes().toArray();
    console.log("Current indexes:", indexes);

    // Find and drop any Firebase-related indexes
    for (const index of indexes) {
      if (
        index.key &&
        (index.key.firebaseUid ||
          Object.keys(index.key).some((key) =>
            key.toLowerCase().includes("firebase")
          ))
      ) {
        console.log("Dropping index:", index.name);
        await User.dropIndex(index.name);
        console.log(`Successfully dropped index ${index.name}`);
      }
    }
    console.log("Finished checking and dropping Firebase indexes");
  } catch (error) {
    console.error("Error managing indexes:", error);
  } finally {
    await mongoose.disconnect();
  }
}

dropFirebaseIndexes();
