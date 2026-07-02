import express from "express";
import {
  createSkill,
  getSkills,
  getSkillById,
  updateSkill,
  deleteSkill,
} from "../controllers/skillController";

import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// Public Routes
router.get("/", getSkills);
router.get("/:id", getSkillById);

// Protected Routes
router.post("/", protect, createSkill);
router.put("/:id", protect, updateSkill);
router.delete("/:id", protect, deleteSkill);

export default router;