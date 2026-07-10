"use server";

import connectDB from "@/lib/db";
import { seedDatabase } from "@/lib/seeder";

let seeded = false;
let dbReady = false;
let dbChecked = false;

export async function ensureSeeded() {
  if (seeded) return;
  try {
    await seedDatabase();
    seeded = true;
  } catch (error) {
    console.error("Seeder error:", error);
  }
}

export async function initApp() {
  console.log("mongo uri", process.env.MONGODB_URI);
  if (!process.env.MONGODB_URI) {
    dbChecked = true;
    dbReady = false;
    return false;
  }

  if (dbReady) return true;
  // if (dbChecked && !dbReady) return false;

  try {
    await connectDB();
    await ensureSeeded();
    dbReady = true;
    dbChecked = true;
    return true;
  } catch (error) {
    console.error("Init error:", error);
    dbChecked = true;
    dbReady = false;
    return false;
  }
}