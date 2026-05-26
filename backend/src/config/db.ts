import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/vedaai";

export let isMongoFallback = false;

export async function connectDB() {
  try {
    console.log(`[Database] Attempting connection to MongoDB at: ${MONGO_URI}`);
    
    // Set a strict 3-second connection timeout to avoid hanging the boot process
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000
    });
    
    console.log("[Database] Successful connection to MongoDB.");
    isMongoFallback = false;
  } catch (error: any) {
    console.warn("\n============================================================");
    console.warn("[DATABASE WARNING] Local MongoDB database was not reachable.");
    console.warn("Reason:", error?.message || error);
    console.warn("Action: Initiating in-memory fallback catalog.");
    console.warn("============================================================\n");
    
    isMongoFallback = true;
  }
}
