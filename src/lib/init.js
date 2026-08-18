"use server";

import connectDB from "@/lib/db";
import { seedDatabase } from "@/lib/seeder";

export async function initApp() {
  if (global.__appInitialized) return true;

  if (!process.env.MONGODB_URI && !process.env.MONGODB_CONNECTION_STRING) {
    return false;
  }

  try {
    await connectDB();
    await seedDatabase();
    global.__appInitialized = true;
    return true;
  } catch (error) {
    console.error("Init error:", error);
    return false;
  }
}