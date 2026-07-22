import express from "express";
import {
  getCurrentUser,
  updateProfile,
} from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";
import { uploadProfileImage } from "../middleware/uploadMiddlerae";
import { uploadProfileImageHandler } from "../controllers/userController";

const router = express.Router();

router.get("/me", protect, getCurrentUser);

router.put("/profile", protect, updateProfile);
router.post("/upload-profile-image", protect, uploadProfileImage.single("image"), uploadProfileImageHandler);

export default router;