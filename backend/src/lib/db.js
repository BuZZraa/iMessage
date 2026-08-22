import mongoose from "mongoose";

export async function connectDB() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI is required");
    }

    const connection = await mongoose.connect(mongoUri);
    console.log("MongoDB connected", connection.connection.host);
  } catch (error) {
    console.log("MongoDB connection error: ", error.message);
    process.exit(1);
    //1 means failed, 0 means success
  }
}
