import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    googleId: { type: String, index: true, unique: true, sparse: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    picture: { type: String, default: "" },
    provider: { type: String, default: "google" }
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);
