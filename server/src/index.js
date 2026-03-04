import dotenv from 'dotenv';
dotenv.config();
import app from "./app.js";
import connectDB from "./utils/db.js";
import mongoose from "mongoose";

const PORT = process.env.PORT || 3000;

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