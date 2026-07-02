import express from "express";
import {
  getCurrentUser,
  updateProfile,
} from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/me", protect, getCurrentUser);

router.put("/profile", protect, updateProfile);

export default router;