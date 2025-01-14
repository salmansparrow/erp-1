import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI_DB;

if (!MONGO_URI) {
  console.error("Error: MONGO_URI is not defined in environment variables.");
  process.exit(1);
}

let isConnected = false;

const dbConnect = async () => {
  if (isConnected) {
    console.log("Already connected to the database.");
    return;
  }

  try {
    const db = await mongoose.connect(MONGO_URI);
    isConnected = db.connections[0].readyState;
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    throw new Error("Failed to connect to database");
  }
};

export default dbConnect;
