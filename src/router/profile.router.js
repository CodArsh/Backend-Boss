// routes/user.routes.js
import express from "express";
import { updateProfile } from "../controller/profile.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import multer from "multer";

const ProfileRouter = express.Router();

// setup multer for file uploads (images)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// PATCH route
ProfileRouter.patch("/", verifyToken, upload.single("image"), updateProfile);

export default ProfileRouter;
