import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGO_URL}`);
    console.log(`MongoDB connected at ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error("Error: ", error);
    process.exit(1) // Provided by Node
  }
};