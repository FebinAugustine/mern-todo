import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
} from "../controllers/authController.js";
import { upload } from "../middleware/upload.js";
import { verifyJWT } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.route("/register").post(upload.single("avatar"), registerUser);
router.route("/login").post(loginUser);

// Protected routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").get(refreshAccessToken); // Changed to GET

export default router;
