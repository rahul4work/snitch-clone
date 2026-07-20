import mongoose from "mongoose";
import { config } from "./config.js";

// Function to connect to MongoDB
const connectToMongoDB = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

export default connectToMongoDB;
