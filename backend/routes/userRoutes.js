import express from "express";
import { verifyJWT } from "../middleware/auth.js";
import { uploadSingleAvatar } from "../middleware/upload.js";
import {
  getUserProfile,
  updateUserDetails,
  updateAvatar,
  updatePassword,
} from "../controllers/userController.js";

const router = express.Router();

router.use(verifyJWT);

router.route("/profile").get(getUserProfile);

router.route("/update-details").put(updateUserDetails);

router.route("/update-avatar").put(uploadSingleAvatar, updateAvatar);

router.route("/update-password").put(updatePassword);

export default router;
