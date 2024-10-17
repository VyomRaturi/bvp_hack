import mongoose from "mongoose";

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;

  await mongoose.connect(
    "mongodb+srv://celestialcart:2oWn1osXKEMNrtIj@cluster0.byqwyex.mongodb.net/bvphack?retryWrites=true&w=majority&appName=Cluster0"
  );
};

export default connectDB;
