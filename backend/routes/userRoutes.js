import express from "express";
import { verifyJWT } from "../middleware/auth.js";
import {
  getUserProfile,
  updateUserAvatar,
} from "../controllers/userController.js";
import { uploadSingleAvatar } from "../middleware/upload.js";

const router = express.Router();

router.use(verifyJWT);

router.route("/profile").get(getUserProfile);
router.route("/avatar").patch(uploadSingleAvatar, updateUserAvatar);

export default router;
