import mongoose from "mongoose";
import { env } from "./env.js";

let connected = false;

export async function connectDatabase() {
  if (connected || !env.mongoUri) {
    return;
  }

  await mongoose.connect(env.mongoUri);
  connected = true;
  console.log("MongoDB connected");
}
