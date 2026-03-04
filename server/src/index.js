import dotenv from 'dotenv';
dotenv.config();
import app from "./app.js";
import connectDB from "./utils/db.js";
import mongoose from "mongoose";

const PORT = process.env.PORT || 3000;

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error("FATAL: JWT_SECRET must be at least 32 characters long");
  process.exit(1);
}

if (!process.env.MONGO_URL) {
  console.error("FATAL: MONGO_URL is not defined");
  process.exit(1);
}

if (!process.env.REFRESH_TOKEN_SECRET || process.env.REFRESH_TOKEN_SECRET.length < 32) {
  console.error("FATAL: REFRESH_TOKEN_SECRET must be at least 32 characters long");
  process.exit(1);
}

connectDB();

const server = app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});

// Unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Graceful shutdown — Ctrl+C ya deployment stop
process.on("SIGINT", async () => {
    console.log("SIGINT received, shutting down gracefully...");
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
    server.close(() => {
      process.exit(0);
    });
  });