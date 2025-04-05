import mongoose from "mongoose";

declare global {
  // Define the mongoose object in global scope
  const mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<typeof mongoose> | null;
  };
}

export {};
