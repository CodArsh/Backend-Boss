import "./src/cronJobs/otpCleanup.js";
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import express from "express";
import cors from "cors";

import AuthRouter from "./src/router/auth.router.js";
import TaskRouter from "./src/router/task.router.js";
import ProfileRouter from "./src/router/profile.router.js";
import PlaceRouter from "./src/router/place.router.js";

const app = express();
(async () => {
  try {
    await mongoose.connect(process.env.DB);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("DB Connection Error:", error.message);
    process.exit(1);
  }
})();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/auth", AuthRouter)
app.use("/task", TaskRouter)
app.use("/update-profile", ProfileRouter)
app.use('/place', PlaceRouter)

app.use((err, req, res, next) => {
  console.error("🔥 Global Error:", err.stack);
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
