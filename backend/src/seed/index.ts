// src/seed/index.ts
import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";
import { createSuperAdmin } from "./superAdmin";

dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

const MONGO_URI = process.env.MONGO_URI as string;

if (!MONGO_URI) {
  throw new Error("❌ MONGO_URI not found in environment variables");
}

async function runSeed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("DB connected");

    await createSuperAdmin();

    console.log("🌱 Seeding completed");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

runSeed();